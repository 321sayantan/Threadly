import express from "express"
import {editUser, followORunfollow, getSuggestedUsers, getUser, login, logout, register} from '../controllers/user.controllers.js'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js'
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getUser);
router.route('/profile/edit').post(isAuthenticated,  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]), editUser);
router.route('/suggestedUser').get(isAuthenticated, getSuggestedUsers);
router.route('/followOrUnfollow/:id').post(isAuthenticated, followORunfollow);
router.route('/getUser/:id').get(isAuthenticated, getUser);


export default router;
