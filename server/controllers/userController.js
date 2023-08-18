import {UserModel} from "../models/userModel.js";

const testRoute = (req, res) => {
	console.log(req);
	res.send("testing route....");
};

const middleTest = (request, response, next) => {
	console.log(request, response, "middleware is up");
	next();
};

const findAllUsers = async (request, response) => {
	try {
		const users = await UserModel.find();
		if (users) {
			response.status(200).json(users);
		} else {
			response.status(404).json({error: "nothing in collection"});
		}
	} catch (e) {
		response.status(500).json({error: "Something went wrong..."});
	}
};

const findUserByEmail = async (req, res) => {
	const {email} = req.params;
	if (email && email.includes("@")) {
		try {
			const foundUser = await UserModel.findOne({email: email});
			if (foundUser) {
				const forFront = {
					email: foundUser.email,
					username: foundUser.username,
					_id: foundUser._id,
					createdAt: foundUser.createdAt,
				};
				res.status(200).json(forFront);
			} else {
				res.status(404).json({error: "No user found"});
			}
		} catch (e) {
			res.status(500).json({error: "Something went wrong"});
		}
	} else {
		res.status(400).json({error: "valid mail must be included"});
	}
};
//TODO: Figure out why images are not getting saved
const createUser = async (req, res) => {
	console.log(req.body, req.file);
	if (!req.body.email || !req.body.password || !req.body.username)
		return res.status(406).json({error: "Please fill out all fields"});
	const result = await imageUpload(req.file, "profile_pics");
	console.log(result);
	const newUser = new UserModel({
		email: req.body.email,
		password: req.body.password,
		username: req.body.username,
		image_url: result,
	});
	try {
		const result = await newUser.save();
		console.log(result);
		res.status(200).json(result);
	} catch (e) {
		console.log(e);
		e.code === 11000
			? res.status(406).json({error: "That email is already registered"})
			: res.status(500).json({error: "Unknown error occured"});
	}
};

const updateUser = async (req, res) => {
	try {
		const result = await UserModel.findByIdAndUpdate(req.body._id, req.body, {
			new: true,
		});
		res.status(200).json(result);
	} catch (e) {
		res.status(500).json({error: "Something went wrong..."});
	}
};

export {
	testRoute,
	findAllUsers,
	findUserByEmail,
	createUser,
	updateUser,
	middleTest,
};
