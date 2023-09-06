import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		email: {type: String, required: true, unique: true},
		username: String,
		comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}], // Assuming your comment model is named 'Comment'
		likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}],
		password: {type: String, required: true},
		image_url: {
			type: String,
			required: true,
			default: 'https://res.cloudinary.com/dorvfgwzc/image/upload/v1692352308/profile_pics/placeholder_img.png',
		},
	},
	{timestamps: true}
);

export const userModel = mongoose.model('user', userSchema);
