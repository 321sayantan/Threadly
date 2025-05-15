import sharp from "sharp";
import cloudinary from "../utils/Cloudinary.js";
import User from "../Models/user.model.js";
import Post from "../Models/post.model.js";
import Comment from "../Models/comment.model.js";

export const createPost = async (req, res) => {
  try {
    const caption = req.body.caption;
    const images = req.files;
    // console.log(req.body.postImages);
    // console.log(images);

    if (images.length<=0) {
      return res
        .status(400)
        .json({ message: "Image is required", success: false });
    }

    const uploadedImages = [];
    for (const image of images) 
    {
      const imageBuffer = await sharp(image.buffer)
        //   .resize({ width: 800, height: 800, fit: "inside" })
        .resize(800, 800)
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const fileuri = `data:image/jpeg;base64,${imageBuffer.toString(
        "base64"
      )}`;

      const cloudinaryimage = await cloudinary.uploader.upload(fileuri, {
        folder: "Instagram Clone",
      });

      uploadedImages.push(cloudinaryimage.secure_url);
    }

    const post = new Post({
      caption,
      images: uploadedImages,
      author: req.id,
    });

    await post.populate({ path: "author", select: "-password" });
    await post.save();

    return res
      .status(200)
      .json({ message: "Post Created Successfully", success: true, post });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const userid = req.id;
    const allPost = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "-password" })
      .populate({
        path: "comments",
        populate: { path: "author", select: "-password" },
      });

    if (!allPost) {
      return res.status(400).json({ message: "No Post Found", success: false });
    }

    return res
      .status(200)
      .json({ message: "All Posts", success: true, allPost });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userid = req.id;
    const userPosts = await Post.find({ author: userid })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "-password" })
      .populate({
        path: "comments",
        populate: { path: "author", select: "-password" },
      });

    if (!userPosts) {
      return res.status(400).json({ message: "No Post Found", success: false });
    }

    return res
      .status(200)
      .json({ message: "User Posts", success: true, userPosts });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const userID = req.id;
    const postID = req.params.id;
    const post = await Post.findById(postID);
    if (!post) {
      return res
        .status(400)
        .json({ message: "Post not found", success: false });
    }

    await post.updateOne({ $addToSet: { likes: userID } });
    await post.save();

    //message notification to the post author

    return res
      .status(200)
      .json({ message: "Post Liked Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const DislikePost = async (req, res) => {
  try {
    const userID = req.id;
    const postID = req.params.id;
    const post = await Post.findById(postID);
    if (!post) {
      return res
        .status(400)
        .json({ message: "Post not found", success: false });
    }

    await post.updateOne({ $pull: { likes: userID } });
    await post.save();

    return res
      .status(200)
      .json({ message: "Like removed Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const userID = req.id;
    const postID = req.params.id;
    const { text } = req.body;
    const post = await Post.findById(postID);
    if (!post) {
      return res
        .status(400)
        .json({ message: "Post not found", success: false });
    }

    const comment = new Comment({
      text,
      author: userID,
      post: postID,
    }).populate({ path: "author", select: "username, profilePicture" });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    //message notification to the post author

    return res
      .status(200)
      .json({ message: "Comment Added Successfully", success: true, comment });
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentID = req.params.id;
    const comment = await Comment.findById(commentID);
    if (!comment) {
      return res
        .status(400)
        .json({ message: "Comment not found", success: false });
    }

    const post = await comment
      .populate({ path: "" })
      .populate({ path: "comments" });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPosts = async (req, res) => {
  try {
    const postID = req.params.id;
    const comments = await Comment.find({ post: postID })
      .populate({ path: "author", select: "username, profilePicture" })
      .sort({ createdAt: -1 });
    if (!comments) {
      return res
        .status(401)
        .json({ message: "No Comments Found", success: false });
    }

    return res
      .status(200)
      .json({ message: "Comments", success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const authorID = req.id;
    const post = await Post.findById(postID);
    if (!post) {
      return res
        .status(400)
        .json({ message: "Post Not Found", success: false });
    }

    console.log(post.author.toString(), authorID);
    if (post.author.toString() !== authorID) {
      return res
        .status(400)
        .json({ message: "You are not authorized", success: false });
    }

    await Post.findByIdAndDelete(postID);
    await Comment.deleteMany({ post: postID });

    let user = await User.findById(authorID);
    user.posts.pull(postID);
    await user.save();

    //delete post image from cloudinary

    return res
      .status(200)
      .json({ message: "Post Deleted Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.id;
    const post = await Post.findById(postID);
    if (!post) {
      return res
        .status(400)
        .json({ message: "Post Not Found", success: false });
    }

    const user = await User.findById(userID);
    if (user.bookmarks.includes(postID)) {
      await user.updateOne({ $pull: { bookmarks: postID } });
      await user.save();
      return res
        .status(200)
        .json({ message: "Post removed from bookmark", success: true });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: postID } });
      await user.save();
      return res
        .status(200)
        .json({ message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
