import sharp from "sharp";
import cloudinary from "../utils/Cloudinary.js";
import Post from "../Models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const caption = req.body.caption;
    const image = req.file;

    if (!image) {
      return res
        .status(400)
        .json({ message: "Image is required", success: false });
    }

    const imageBuffer = await sharp(image.buffer)
    //   .resize({ width: 800, height: 800, fit: "inside" })
      .resize(800,800)
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

      const fileuri = `data:image/jpeg;base64,${imageBuffer.toString(
        "base64"
      )}`;

      const cloudinaryimage = await cloudinary.uploader.upload(fileuri, {
        folder: "Instagram Clone",
      });

    const post = new Post({
        caption,
        image: cloudinaryimage.secure_url,
        author: req.id,
    });

    await post.populate({path: 'author', select: '-password'});
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
        const k=0;
    } catch (error) {
        console.log(error)
    }
}
