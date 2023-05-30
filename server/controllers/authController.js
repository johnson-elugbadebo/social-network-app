import User from '../models/User.js';
import { hashPassword, comparePassword } from '../helpers/authHelpers.js';
import { StatusCodes } from 'http-status-codes';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

const register = async function (req, res) {
	// console.log('Register Endpoint ==>', req.body);
	const { name, email, password, secret } = req.body;

	// Check for empty values submitted
	// 400 is Bad Request Error
	if (!name) {
		return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Name is required' });
	}

	if (!password || password.length < 6) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'Password is required and should be 6 characters long' });
	}

	if (!secret) {
		return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Secret answer is required' });
	}

	const userAlreadyExists = await User.findOne({ email });
	if (userAlreadyExists) {
		return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email is already in use' });
	}

	// Hash Password
	const encryptedPassword = await hashPassword(password);

	try {
		const user = await User.create({
			name,
			email,
			password: encryptedPassword,
			secret,
			username: nanoid(6),
		});
		// console.log('Registered User', user);
		return res.status(StatusCodes.CREATED).json({ name: user.name, email: user.email });
	} catch (error) {
		console.log('Registration Failed', error);
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'Registration failed. Please try again.' });
	}
};

const login = async function (req, res) {
	// console.log(req.body);
	try {
		const { email, password } = req.body;

		// check if email and password is provided
		if (!email || !password) {
			return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email and Password are required' });
		}

		// Check if database has user with that email
		// when you use findOne method to find user, password does not come back because of 'select: false' option on User model
		// Must override that with .select('+password)
		const user = await User.findOne({ email }).select('+password');
		if (!user) {
			return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid email credentials' });
		}

		const isPasswordCorrect = await comparePassword(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid password credentials' });
		}

		// Create Signed-in Token
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

		// Set password and secret to undefined so password is removed from response
		user.password = undefined;
		user.secret = undefined;

		// console.log(user);
		res.status(StatusCodes.OK).json({
			token,
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Login failed. Please try again.' });
	}
};

const currentUser = async function (req, res) {
	// console.log(req.auth);

	try {
		const user = await User.findById(req.auth._id);
		// res.status(StatusCodes.OK).json({ msg: 'User confirmed', data: user });
		res.status(StatusCodes.OK).json({ ok: true });
	} catch (error) {
		console.log(error);
		res.sendStatus(StatusCodes.BAD_REQUEST);
	}
};

const forgotPassword = async function (req, res) {
	// console.log(req.body);
	const { email, newPassword, secret } = req.body;

	// Validation
	// Check if password is provided
	if (!email || !newPassword || newPassword.length < 6) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			msg: 'Email is required. Password is also required and should be 6 characters long',
		});
	}

	if (!secret) {
		return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Secret answer is required' });
	}

	const user = await User.findOne({ email, secret }).select('+password');

	if (!user) {
		return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid credentials' });
	}

	try {
		// Hash Password
		const encryptedPassword = await hashPassword(newPassword);
		await User.findByIdAndUpdate(user._id, { password: encryptedPassword });
		return res.status(StatusCodes.CREATED).json({ msg: 'Success! Password updated.' });
	} catch (error) {
		console.log(error);
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'Password reset failed. Please try again.' });
	}
};

const updateProfile = async function (req, res) {
	try {
		// console.log('Profile Update ==>', req.body);
		const data = {};

		if (req.body.username) {
			data.username = req.body.username;
		}

		if (req.body.about) {
			data.about = req.body.about;
		}

		if (req.body.name) {
			data.name = req.body.name;
		}

		if (req.body.password) {
			if (req.body.password.length < 6) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ error: 'Password is required and should be 6 characters long' });
			} else {
				data.password = await hashPassword(req.body.password);
			}
		}

		if (req.body.secret) {
			data.secret = req.body.secret;
		}

		if (req.body.image) {
			data.image = req.body.image;
		}

		let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });

		user.password = undefined;
		user.secret = undefined;
		// console.log('Updated User ==>', user);
		res.status(StatusCodes.OK).json({ user });

		// console.log(user);
	} catch (error) {
		if (error.code == 11000) {
			res.status(StatusCodes.BAD_REQUEST).json({ error: 'Those credentials are already in use.' });
		}
		console.log(error);
	}
};

const findPeople = async function (req, res) {
	try {
		// Find logged in user
		const user = await User.findById(req.auth._id);
		// User following
		let following = user.following;
		following.push(user._id);
		const people = await User.find({ _id: { $nin: following } }).limit(20);
		res
			.status(StatusCodes.OK)
			.json({ success: 'Here are all the users on the platform.', people: people });
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Unable to find all users. Please try again.' });
	}
};

// addFollower middleware
const addFollower = async function (req, res, next) {
	try {
		// Add logged in user to "followers" array of target
		const user = await User.findByIdAndUpdate(req.body._id, {
			$addToSet: { followers: req.auth._id },
		});
		next();
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Unable to add logged in user to target followers list. Please try again.' });
	}
};

// userFollow endpoint
const userFollow = async function (req, res) {
	try {
		// Add target user to "following" array
		const user = await User.findByIdAndUpdate(
			req.auth._id,
			{
				$addToSet: { following: req.body._id },
			},
			{ new: true }
		);
		res
			.status(StatusCodes.OK)
			.json({ success: `Added ${req.body.name} to your following list.`, user: user });
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Unable to add user to your following list. Please try again.' });
	}
};

const userFollowing = async function (req, res) {
	try {
		// Pull logged in users document, then access its following list
		const user = await User.findById(req.auth._id);
		const following = await User.find({ _id: user.following });
		res
			.status(StatusCodes.OK)
			.json({ success: `The list of users you are following has rendered.`, following: following });
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Unable render the list of users you are following. Please try again.' });
	}
};

// removeFollower middleware
const removeFollower = async function (req, res, next) {
	try {
		// Remove logged in user from "followers" array of target
		const user = await User.findByIdAndUpdate(req.body._id, {
			$pull: { followers: req.auth._id },
		});
		next();
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({
			error: 'Unable remove logged in user from target followers list. Please try again.',
		});
	}
};

// userUnFollow endpoint
const userUnFollow = async function (req, res) {
	console.log(req.body);
	try {
		// Remove target user from "following" array
		const user = await User.findByIdAndUpdate(
			req.auth._id,
			{
				$pull: { following: req.body._id },
			},
			{ new: true }
		);
		res
			.status(StatusCodes.OK)
			.json({ success: `Removed ${req.body.name} from your following list.`, user: user });
	} catch (error) {
		console.log(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Unable to remove user from your following list. Please try again.' });
	}
};

const searchUser = async function (req, res) {
	// console.log(req.params);
	const { query } = req.params;
	if (!query) return;

	try {
		// $regex is a special method from MongoDB
		// The i modifier is used to perform case-insensitive matching
		const user = await User.find({
			$or: [
				{ name: { $regex: query, $options: 'i' } },
				{ username: { $regex: query, $options: 'i' } },
			],
		}).select({ password: 0, secret: 0 });
		res.status(StatusCodes.OK).json({ success: `Query successful.`, user: user });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Query unsuccessful.' });
	}
};

const getUser = async function (req, res) {
	try {
		// Find user
		const user = await User.findOne({ username: req.params.username }).select({
			password: 0,
			secret: 0,
		});

		res.status(StatusCodes.OK).json({ success: 'Here is the user.', user: user });
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Unable to find user. Please try again.' });
	}
};

export {
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
};
