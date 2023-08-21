import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {type: String, required: true, unique: true},
		username: String,
		// comments: [{type: ObjectId, ref: "Comment"}],
		password: {type: String, required: true},
		image_url: {
			type: String,
			required: true,
			default:
				"https://res.cloudinary.com/dorvfgwzc/image/upload/v1692352308/profile_pics/placeholder_img.png",
		},
	},
	{timestamps: true}
);

export const UserModel = mongoose.model("user", userSchema);
