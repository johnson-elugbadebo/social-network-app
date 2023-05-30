import express from 'express';
import {
	register,
	login,
	currentUser,
	forgotPassword,
	updateProfile,
	findPeople,
	addFollower,
	userFollow,
	userFollowing,
	removeFollower,
	userUnFollow,
	searchUser,
	getUser,
} from '../controllers/authController.js';
import { isAdmin, requireSignin } from '../middleware/authenticate.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', requireSignin, currentUser);
router.post('/forgot-password', forgotPassword);
router.put('/profile-update', requireSignin, updateProfile);
router.get('/find-people', requireSignin, findPeople);
router.put('/user-follow', requireSignin, addFollower, userFollow);
router.put('/user-unfollow', requireSignin, removeFollower, userUnFollow);
router.get('/user-following', requireSignin, userFollowing);
router.get('/search-user/:query', searchUser);
router.get('/user/:username', getUser);
router.get('/current-admin', requireSignin, isAdmin, currentUser);

export { router as authRouter };
