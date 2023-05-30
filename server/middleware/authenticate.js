import { expressjwt } from 'express-jwt';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';

const requireSignin = expressjwt({
	secret: 'JaNcRfUjXn2r5u8x/A?D(G+KbPeSgVkY',
	algorithms: ['HS256'],
});

const canEditDeletePost = async function (req, res, next) {
	try {
		const post = await Post.findById(req.params.id);

		// console.log('Post Edit Delete Middleware ==>', post);
		// console.log(req);

		if (req.auth._id != post.postedBy) {
			res.status(StatusCodes.BAD_REQUEST).json({ error: 'You are not allowed to edit this post.' });
		} else {
			next();
		}
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'You are not authorized to edit this post.' });
	}
};

const isAdmin = async function (req, res, next) {
	try {
		const user = await User.findById(req.auth._id);

		if (user.role !== 'Admin') {
			res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: 'You are not authorized to view this material.' });
		} else {
			next();
		}
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'You are not authorized to view this material.' });
	}
};

export { requireSignin, canEditDeletePost, isAdmin };
