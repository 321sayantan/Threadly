import express from 'express';
import { createPost, deletePost, DislikePost, getAllPosts, getUserPosts, likePost } from '../controllers/post.controllers.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/createPost').post(isAuthenticated, upload.array('postImages', 5), createPost);
router.route('/getAllPost').get(isAuthenticated, getAllPosts);
router.route('/getUserPosts').get(isAuthenticated, getUserPosts);
router.route('/deletePost/:id').get(isAuthenticated, deletePost);
router.route('/likePost/:id').get(isAuthenticated, likePost);
router.route('/dislikePost/:id').get(isAuthenticated, DislikePost);

export default router;