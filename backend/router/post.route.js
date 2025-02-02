import express from 'express';
import { createPost } from '../controllers/post.controllers.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/createPost').post(isAuthenticated, upload.single('postImage'), createPost);

export default router;