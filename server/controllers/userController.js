import {UserModel} from '../models/userModel.js';
import imageUpload from '../utils/imageManagement.js';

const testRoute = (req, res) => {
	console.log(req);
	res.send('testing route....');
};

const middleTest = (request, response, next) => {
	console.log(request, response, 'middleware is up');
	next();
};

const findAllUsers = async (request, response) => {
	try {
		const users = await UserModel.find();
		if (users) {
			response.status(200).json(users);
		} else {
			response.status(404).json({error: 'nothing in collection'});
		}
	} catch (e) {
		response.status(500).json({error: 'Something went wrong...'});
	}
};

const findUserByEmail = async (req, res) => {
	const {email} = req.params;
	if (email && email.includes('@')) {
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
				res.status(404).json({error: 'No user found'});
			}
		} catch (e) {
			res.status(500).json({error: 'Something went wrong'});
		}
	} else {
		res.status(400).json({error: 'valid mail must be included'});
	}
};
const createUser = async (req, res) => {
	const {email, password, username} = req.body;
	console.log(req.body, req.file);
	if (!email || !password || !username)
		return res.status(406).json({error: 'Please fill out all fields'});
	const result = await imageUpload(req.file, 'profile_pics');
	const newUser = new UserModel({
		email,
		password,
		username,
		image_url: result,
	});
	try {
		const result = await newUser.save();
		const forFront = {
			email: result.email,
			username: result.username,
			_id: result._id,
			createdAt: result.createdAt,
			image_url: result.image_url,
		};
		res.status(200).json(result);
		console.log(result);
	} catch (e) {
		console.log(e);
		e.code === 11000
			? res.status(406).json({error: 'That email is already registered'})
			: res.status(500).json({error: 'Unknown error occured'});
	}
};

const updateUser = async (req, res) => {
	try {
		if (req.file) {
			const newProfilePicture = await imageUpload(req.file, 'profile_pics');
			const result = await UserModel.findByIdAndUpdate(
				req.body._id,
				{...req.body, image_url: newProfilePicture},
				{
					new: true,
				}
			);
			res.status(200).json(result);
			console.log(result);
		} else {
			const result = await UserModel.findByIdAndUpdate(req.body._id, req.body, {
				new: true,
			});
			res.status(200).json(result);
			console.log(result);
		}
	} catch (e) {
		res.status(500).json({error: 'Something went wrong...'});
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
