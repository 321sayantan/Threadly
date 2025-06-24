import express from "express"
import {deleteCertificate, deleteEducation, deleteExperience, editCertifications, editEducation, editExperience, editSkillsAndInterest, editUser, followORunfollow, getSuggestedUsers, getUser, login, logout, register} from '../controllers/user.controllers.js'
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
router.route('/editSkillsInterest').post(isAuthenticated, editSkillsAndInterest);
router.route('/editExperience').post(isAuthenticated, editExperience);
router.route('/deleteExperience/:id').get(isAuthenticated, deleteExperience);
router.route("/editEducation").post(isAuthenticated, editEducation);
router.route("/deleteEducation/:id").get(isAuthenticated, deleteEducation);
router.route("/editCertificates").post(isAuthenticated, editCertifications);
router.route("/deleteCertificate/:id").get(isAuthenticated, deleteCertificate);


export default router;
