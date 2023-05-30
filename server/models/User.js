// Import Mongoose
import mongoose from 'mongoose';
// Import Validator to validate email addresses
import validator from 'validator';

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide your name'],
			trim: true,
			maxLength: [20, 'Name cannot be more than 20 characters'],
			minLength: [2, 'First name must be at least 2 characters'],
		},
		email: {
			type: String,
			required: [true, 'Please provide email'],
			validate: {
				validator: validator.isEmail,
				message: 'Please provide a valid email',
			},
			unique: true, // user must submit an email that is unique, not already in use
		},
		password: {
			type: String,
			required: [true, 'Please provide password'],
			minLength: [6, 'Password must be at least 6 characters'],
			maxLength: [64, 'Password cannot be more than 64 characters'],
			select: false, // password still returns b/c of user.create in register user controller
		},
		secret: {
			type: String,
			required: [true, 'Please provide secret'],
			select: false, // secret still returns b/c of user.create in register user controller
		},
		username: {
			type: String,
			unique: true,
			required: [true, 'Please provide your username'],
			trim: true,
			maxLength: [20, 'Name cannot be more than 20 characters'],
			minLength: [2, 'First name must be at least 2 characters'],
		},
		about: {},
		role: {
			type: String,
			default: 'Subsriber',
		},
		image: {
			url: String,
			public_id: String,
		},
		following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
		followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

// Compile model from Schema
// Parameters when exporting are model name and schema
export default mongoose.model('User', UserSchema);
