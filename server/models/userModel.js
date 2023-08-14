import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {type: String, required: true},
		username: String,
		password: {type: String, required: true},
	},
	{timestamps: true}
);
