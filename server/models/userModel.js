import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {type: String, required: true, unique: true},
		username: String,
		password: {type: String, required: true},
	},
	{timestamps: true}
);



export const UserModel = mongoose.model("user", userSchema);
