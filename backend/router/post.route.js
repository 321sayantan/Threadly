import express from 'express';
import { createPost, getAllPosts, getUserPosts } from '../controllers/post.controllers.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/createPost').post(isAuthenticated, upload.array('postImages', 5), createPost);
router.route('/getAllPost').get(isAuthenticated, getAllPosts);
router.route('/getUserPosts').get(isAuthenticated, getUserPosts);

export default router;