import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});
// 1. Define storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // folder where files will be stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// 2. Create multer instance
// const upload = multer({ storage });

export default upload;