import express from 'express';
import { requireSignin, canEditDeletePost, isAdmin } from '../middleware/authenticate.js';
import {
	createPost,
	uploadImage,
	postsByUser,
	getUserPost,
	updateUserPost,
	deleteUserPost,
	getNewsFeed,
	likePost,
	unLikePost,
	addComment,
	removeComment,
	totalPosts,
	posts,
	getPost,
} from '../controllers/postController.js';
import fileupload from 'express-fileupload';
const router = express.Router();

router.post('/create-post', requireSignin, createPost);
router.post(
	'/upload-image',
	requireSignin,
	fileupload({
		useTempFiles: true,
	}),
	uploadImage
);
// Render Posts
router.get('/render/user-posts', requireSignin, postsByUser);
router.get('/render/news-feed/:current', requireSignin, getNewsFeed);
// Edit Posts
router.get('/render/get-post/:id', requireSignin, getUserPost);
router.put('/render/update-post/:id', requireSignin, canEditDeletePost, updateUserPost);
// Delete Posts
router.delete('/render/delete-post/:id', requireSignin, canEditDeletePost, deleteUserPost);
// Like & Unlike
router.put('/render/like-post', requireSignin, likePost);
router.put('/render/unlike-post', requireSignin, unLikePost);
// Comments
router.put('/render/add-comment', requireSignin, addComment);
router.put('/render/remove-comment', requireSignin, removeComment);
// Pagination
router.get('/render/total-posts', totalPosts);

// Posts - Home Page
router.get('/render/posts', posts);

// Posts - Single Page
router.get('/render/post/:id', getPost);

// Admin Rights
// Delete Posts
router.delete('/admin/render/delete-post/:id', requireSignin, isAdmin, deleteUserPost);

export { router as postRouter };
