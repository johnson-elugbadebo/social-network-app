// Import Mongoose
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
	{
		content: {
			type: {},
			required: true,
		},
		postedBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		image: {
			url: String,
			public_id: String,
		},
		likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
		comments: [
			{
				text: String,
				created: {
					type: Date,
					default: Date.now,
				},
				postedBy: {
					type: mongoose.Types.ObjectId,
					ref: 'User',
				},
			},
		],
	},
	{ timestamps: true }
);

// Compile model from Schema
// Parameters when exporting are model name and schema
export default mongoose.model('Post', PostSchema);
