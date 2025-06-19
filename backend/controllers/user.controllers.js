import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import Cloudinary from "../utils/Cloudinary.js";
import promise from 'promise';
import bcrypt from "bcryptjs";
import getPublicIdFromUrl from "../utils/extractImageID.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Please enter all the details!",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "This email in already registered!",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashPassword });

    return res
      .status(200)
      .json({ message: "Registration Successful", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Enter Email and Password", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Email or Password", success: false });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res
        .status(401)
        .json({ message: "Invalid Email or Password", success: false });
    }

    const token = await jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userdata = await User.findById(user._id).select("-password");

    return res
      .cookie("token", token, { httpOnly: true, sameSite: "strict" })
      .json({
        message: `Welcome back! ${user.username}`,
        success: true,
        userdata,
      });

  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged Out Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false });
    }
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const editUser = async (req, res) => {
  try {
    const id = req.id;
    const { username, title, location, links, bio, gender } = req.body;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    const parsedLinks = JSON.parse(links);
    const profileImage = req.files.profilePicture?.[0];
    const coverImage = req.files.coverImage?.[0];

    if (username) user.username = username;
    if (title) user.title = title;
    if (location) user.location = location;
    if (links) user.links = parsedLinks;
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    

    if (profileImage) {
      //deleting previous image if any
      if(user.profilePicture){
        const imageID = getPublicIdFromUrl(user.profilePicture);
        // console.log(imageID);
        const response = await Cloudinary.uploader.destroy(
          imageID,
          (error, result) => {
            if (error) {
              console.error("Error deleting image:", error);
            } else {
              console.log("Image deleted successfully:", result);
            }
          }
        );
      }
      //uploading new image
      const fileUri = getDataUri(profileImage);
      const cloudResponse = await Cloudinary.uploader.upload(fileUri, {
        folder: "Instagram Clone",
      });
      user.profilePicture = cloudResponse.secure_url;
    }

    if (coverImage) {
      //deleting previous image if any
      if (user.coverImage) {
        const imageID = getPublicIdFromUrl(user.coverImage);
        // console.log(imageID);
        const response = await Cloudinary.uploader.destroy(
          imageID,
          (error, result) => {
            if (error) {
              console.error("Error deleting image:", error);
            } else {
              console.log("Image deleted successfully:", result);
            }
          }
        );
      }
      //uploading new image
      // console.log(coverImage);
      const fileUri = getDataUri(coverImage);
      const cloudResponse = await Cloudinary.uploader.upload(fileUri, {
        folder: "Instagram Clone",
      });
      user.coverImage = cloudResponse.secure_url;
    }
    console.log("profile update")

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile Updated Successfully", success: true, user });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    ).limit(5);
    console.log("user suggestion")
    if (suggestedUser.length === 0) {
      return res
        .status(401)
        .json({ message: "No Suggestion Available", success: false });
    }

    return res.status(200).json({ success: true, user: suggestedUser });
  } catch (error) {
    console.log(error);
  }
};

export const followORunfollow = async (req, res) => {
  try {
    const currentUser = req.id;
    const toBeFollowed = req.params.id;

    if (currentUser === toBeFollowed) {
      return res.status(401).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(currentUser);
    const targetUser = await User.findById(toBeFollowed);

    if (!user || !targetUser) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    const isFollowing = user.following.includes(toBeFollowed);
    if (isFollowing) {
      //unfollow logic
      await promise.all([
        User.updateOne(
          { _id: currentUser },
          { $pull: { following: toBeFollowed } }
        ),
        User.updateOne(
          { _id: toBeFollowed },
          { $pull: { followers: currentUser } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed Successfully", isFollowing: false, success: true });
    } else {
      //follow logic
      await promise.all([
        User.updateOne(
          { _id: currentUser },
          { $push: { following: toBeFollowed } }
        ),
        User.updateOne(
          { _id: toBeFollowed },
          { $push: { followers: currentUser } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Followed Successfully", isFollowing: true, success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
