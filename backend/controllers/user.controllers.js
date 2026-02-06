import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import Cloudinary from "../utils/Cloudinary.js";
import promise from "promise";
import bcrypt from "bcryptjs";
import getPublicIdFromUrl from "../utils/extractImageID.js";
import mongoose from "mongoose";

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
    console.log(req.body);
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

    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      // expiresIn: "1d",
    });

    const userdata = await User.findById(user._id).select("-password");

    return res
      .cookie(
        "token",
        token
        // { httpOnly: true, sameSite: "strict" }
      )
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
    const user = await User.findById(req.params.id)
      .populate({
        path: "posts",
        populate: { path: "author", select: "-password" },
      })
      .select("-password");
    console.log(1, user);
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

    const user = await User.findById(id)
      .populate({
        path: "posts",
        populate: { path: "author", select: "-password" },
      })
      .select("-password");
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
      if (user.profilePicture) {
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
    console.log("profile update");

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile Updated Successfully", success: true, user });
  } catch (error) {
    console.log(error);
  }
};

export const editSkillsAndInterest = async (req, res) => {
  try {
    const userID = req.id;
    const { skills, interest } = req.body;
    const user = await User.findById(userID).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
    }

    if (skills) {
      user.skills = skills;
    }

    if (interest) {
      user.interests = interest;
    }

    await user.save();

    res
      .status(200)
      .json({ message: "Skills/Interest Updated Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const editExperience = async (req, res) => {
  try {
    const userID = req.id;
    const { experience } = req.body;

    const user = await User.findById(userID).select("-password");
    if (!user) {
      res.status(404).json({ message: "User Not Found", success: false });
    }
    // console.log(experience)
    if (experience._id) {
      // console.log("with ID");
      const index = user.experience.findIndex(
        (exp) => exp._id.toString() === experience._id
      );

      if (index !== -1) {
        user.experience[index] = {
          ...user.experience[index],
          ...experience, // new updated fields
        };
      }

      // user.experience.map((exp)=>{
      //   console.log(exp._id.toString())
      // })
    } else {
      // console.log("without ID");
      user.experience = [
        { ...experience, _id: new mongoose.Types.ObjectId().toString() },
        ...user.experience,
      ];
    }

    await user.save();

    // console.log(10, user);

    res.status(200).json({
      message: "Experience Updated!",
      success: true,
      experience: user.experience,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const userID = req.id;
    const expID = req.params.id;

    // console.log(expID)

    const user = await User.findById(userID).select("-password");

    if (!user) {
      res.status(404).json({ message: "User Not Found", success: false });
    }

    user.experience = user.experience.filter(
      (exp) => exp._id.toString() !== expID
    );

    await user.save();

    res.status(200).json({ message: "Experience Deleted!", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const editEducation = async (req, res) => {
  try {
    const userID = req.id;
    const { education } = req.body;

    const user = await User.findById(userID).select("-password");
    if (!user) {
      res.status(404).json({ message: "User Not Found!", success: false });
    }

    if (education._id) {
      const index = user.education.findIndex(
        (exp) => exp._id.toString() === education._id
      );
      if (index !== -1) {
        user.education[index] = {
          ...user.education[index],
          ...education,
        };
      }
      // console.log(user.education);
    } else {
      user.education = [
        { ...education, _id: new mongoose.Types.ObjectId().toString() },
        ...user.education,
      ];
    }

    await user.save();
    // console.log(user)

    res.status(200).json({
      message: "Education Updated!",
      success: true,
      education: user.education,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const userID = req.id;
    const eduID = req.params.id;

    // console.log(expID)

    const user = await User.findById(userID).select("-password");

    if (!user) {
      res.status(404).json({ message: "User Not Found", success: false });
    }

    user.education = user.education.filter(
      (edu) => edu._id.toString() !== eduID
    );

    await user.save();

    res.status(200).json({ message: "Experience Deleted!", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const editCertifications = async (req, res) => {
  try {
    const userID = req.id;
    const { certificate } = req.body;

    const user = await User.findById(userID).select("-password");
    if (!user) {
      res.status(404).json({ message: "User Not Found!", success: false });
    }

    if (certificate._id) {
      const index = user.certificate.findIndex(
        (cert) => cert._id.toString() === certificate._id
      );
      if (index !== -1) {
        user.certificate[index] = {
          ...user.certificate[index],
          ...certificate,
        };
      }
      // console.log(user.education);
    } else {
      user.certificate = [
        { ...certificate, _id: new mongoose.Types.ObjectId().toString() },
        ...user.certificate,
      ];
    }

    await user.save();
    // console.log(user)

    res.status(200).json({
      message: "Certificates Updated!",
      success: true,
      certificate: user.certificate,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const userID = req.id;
    const certID = req.params.id;

    // console.log(expID)

    const user = await User.findById(userID).select("-password");

    if (!user) {
      res.status(404).json({ message: "User Not Found", success: false });
    }

    user.certificate = user.certificate.filter(
      (cert) => cert._id.toString() !== certID
    );

    await user.save();
    // console.log(user)

    res.status(200).json({ message: "Certificate Deleted!", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } })
      .select("-password")
      .limit(5);
    console.log("user suggestion");
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
      return res.status(200).json({
        message: "Unfollowed Successfully",
        isFollowing: false,
        success: true,
      });
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
      return res.status(200).json({
        message: "Followed Successfully",
        isFollowing: true,
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        message: "Search query is required",
        success: false
      });
    }

    // Search users by username, bio, skills, company, or school
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } },
        { skills: { $in: [new RegExp(query, 'i')] } },
        { 'experience.company': { $regex: query, $options: 'i' } },
        { 'experience.position': { $regex: query, $options: 'i' } },
        { 'education.school': { $regex: query, $options: 'i' } },
        { 'education.degree': { $regex: query, $options: 'i' } }
      ]
    })
    .select('-password')
    .limit(20);

    return res.status(200).json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error searching users",
      success: false
    });
  }
};