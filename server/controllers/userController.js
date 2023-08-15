import {UserModel} from "../models/userModel.js";

const testRoute = (req, res) => {
	console.log(req);
	res.send("testing route....");
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
				res.status(200).json(foundUser);
			} else {
				res.status(404).json({error: "No user found"});
			}
		} catch (e) {
			res.status(500).json({error: "Something went wrong"});
		}
	} else {
		res.status(400).json({error: "valid mail must be included"});
	}
	console.log(req.params);
};

export {testRoute, findAllUsers, findUserByEmail};
