import mongoose from "mongoose";

const commentModel = new mongoose.Schema(
	{
		comment: String,
		likes: [String],
		owner: [{type: ObjectId, ref: "User"}],
		date: String,
	},
	{timestamps: true}
);

export const CommentModel = mongoose.model("comment", commentModel);
