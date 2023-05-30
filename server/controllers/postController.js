import { StatusCodes } from 'http-status-codes';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
	cloud_name: 'dm6efhql8',
	api_key: '357165431244535',
	api_secret: '_yftQgOrch_cle3iA8STRNq-6hw',
	secure: true,
});

const createPost = async function (req, res) {
	// console.log('Post ==>', req.body);
	// console.log(req);

	const { content, image } = req.body;

	if (!content.length) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Content is required.' });
	}

	try {
		const post = await Post.create({ content, image, postedBy: req.auth._id });
		const postCreated = await Post.findById(post._id).populate({
			path: 'postedBy',
			select: '_id name image',
		});
		res
			.status(StatusCodes.CREATED)
			.json({ success: 'Your post was created.', postCreated: postCreated });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Your post was not recorded.' });
	}
};

const uploadImage = async function (req, res) {
	// console.log('Req.Files ==>', req.files);

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No files were uploaded.' });
	}

	try {
		const { image } = req.files;
		const cloudFile = await cloudinary.uploader.upload(image.tempFilePath);
		// console.log('Cloudfile ==>', cloudFile);
		return res.status(StatusCodes.OK).json({
			imageURL: cloudFile.secure_url,
			public_id: cloudFile.public_id,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Image upload was not successful. Please try again.' });
	}
};

const postsByUser = async function (req, res) {
	try {
		// const userPosts = await Post.find({ postedBy: req.auth._id })
		// Find all posts, not just those by user
		const userPosts = await Post.find()
			.populate({ path: 'postedBy', select: '_id name image' })
			.sort({ createdAt: -1 })
			.limit(10);
		// console.log('User Posts ==>', userPosts);
		return res.status(StatusCodes.OK).json({ success: 'Your posts were rendered.', userPosts });
	} catch (error) {
		console.log(error);
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Posts were not rendered. Please try again.' });
	}
};

const getUserPost = async function (req, res) {
	// console.log(req.params);
	try {
		const userPost = await Post.findById(req.params.id)
			.populate({ path: 'postedBy', select: '_id name image' })
			.populate({ path: 'comments.postedBy', select: '_id name image' });
		res.status(StatusCodes.OK).json({ success: 'You can edit your post.', userPost: userPost });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Unable to fetch user post.' });
	}
};

const updateUserPost = async function (req, res) {
	console.log('Post Update Controller', req.body);

	try {
		const userPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.status(StatusCodes.OK).json({ success: 'You have updated your post.', userPost });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Your post was not updated.' });
	}
};

const deleteUserPost = async function (req, res) {
	try {
		// remove post from database
		const userPost = await Post.findByIdAndDelete(req.params.id);
		// remove image from cloudinary
		if (userPost.image && userPost.image.public_id) {
			const image = await cloudinary.uploader.destroy(userPost.image.public_id);
		}
		res.status(StatusCodes.OK).json({ success: 'You have deleted your post.' });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Your post was not deleted.' });
	}
};

const getNewsFeed = async function (req, res) {
	try {
		// Find logged in user
		const user = await User.findById(req.auth._id);
		// User following
		let following = user.following;
		following.push(user._id);
		// pagination
		const currentPage = req.params.current || 1;
		const perPage = 10;

		const posts = await Post.find({ postedBy: { $in: following } })
			.populate({ path: 'postedBy', select: '_id name image' })
			.populate({ path: 'comments.postedBy', select: '_id name image' })
			.sort({ createdAt: -1 })
			.skip((currentPage - 1) * perPage)
			.limit(perPage);

		res.status(StatusCodes.OK).json({ success: 'Your news feed was rendered.', posts: posts });
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Your news feed was not rendered. Please try again.' });
	}
};

const likePost = async function (req, res) {
	try {
		// Find Post and add User's _id to Likes Array
		const post = await Post.findByIdAndUpdate(
			req.body._id,
			{
				$addToSet: { likes: req.auth._id },
			},
			{ new: true }
		);
		res.status(StatusCodes.OK).json({ success: 'Your like was recorded.', post: post });
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Your like was not recorded. Please try again.' });
	}
};

const unLikePost = async function (req, res) {
	try {
		// Find Post and remove User's _id from Likes Array
		const post = await Post.findByIdAndUpdate(
			req.body._id,
			{
				$pull: { likes: req.auth._id },
			},
			{ new: true }
		);
		res.status(StatusCodes.OK).json({ success: 'Your like was removed.', post: post });
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Your like was not removed. Please try again.' });
	}
};

const addComment = async function (req, res) {
	try {
		// Destructure post ID and comments
		const { postID, comment } = req.body;
		// Find Post
		const post = await Post.findByIdAndUpdate(
			postID,
			{
				$push: { comments: { text: comment, postedBy: req.auth._id } },
			},
			{ new: true }
		)
			.populate({ path: 'postedBy', select: '_id name image' })
			.populate({ path: 'comments.postedBy', select: '_id name image' });
		res.status(StatusCodes.OK).json({ success: 'Your comment has been recorded.', post: post });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Your comment was not recorded.' });
	}
};

const removeComment = async function (req, res) {
	try {
		// Destructure post ID and comments
		const { postID, comment } = req.body;
		// Find Post
		const post = await Post.findByIdAndUpdate(
			postID,
			{
				$pull: { comments: { _id: comment._id } },
			},
			{ new: true }
		);
		res.status(StatusCodes.OK).json({ success: 'Your comment has been removed.', post: post });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Your comment was not removed.' });
	}
};

const totalPosts = async function (req, res) {
	try {
		const total = await Post.find().estimatedDocumentCount();
		res.status(StatusCodes.OK).json({ success: 'Document count complete.', total: total });
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Unable to tabulate total number of posts.' });
	}
};

const posts = async function (req, res) {
	try {
		const posts = await Post.find()
			.populate({ path: 'postedBy', select: '_id name image' })
			.populate({ path: 'comments.postedBy', select: '_id name image' })
			.sort({ createdAt: -1 });
		// console.log(posts);
		res.status(StatusCodes.OK).json({ success: 'Here are your latest 10 posts.', posts: posts });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Your latest posts did not render.' });
	}
};

const getPost = async function (req, res) {
	// console.log(req.params.id);
	try {
		const post = await Post.findById(req.params.id)
			.populate({ path: 'postedBy', select: '_id name image' })
			.populate({ path: 'comments.postedBy', select: '_id name image' });
		res.status(StatusCodes.OK).json({ success: 'Post retrieved.', post: post });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Unable to retrieve post.' });
	}
};

export {
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
};
