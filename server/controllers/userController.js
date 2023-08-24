import {UserModel} from '../models/userModel.js';
import {encryptPassword, verifyPassword} from '../utils/bcrypt.js';
import imageUpload from '../utils/imageManagement.js';
import {generateToken} from '../utils/jwt.js';

// const testRoute = (req, res) => {
// 	console.log(req);
// 	res.send('testing route....');
// };

// const middleTest = (request, response, next) => {
// 	console.log(request, response, 'middleware is up');
// 	next();
// };

const findAllUsers = async (request, response) => {
	const users = await UserModel.find();

	try {
		if (users) {
			const forFront = [];
			users.forEach((user) =>
				forFront.push({
					email: user.email,
					username: user.username,
					createdAt: user.createdAt,
					_id: user._id,
					image_url: user.image_url,
				})
			);
			response.status(200).json(forFront);
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
	const imageResult = await imageUpload(req.file, 'profile_pics');
	const hashedPassword = await encryptPassword(password);
	const newUser = new UserModel({
		email,
		password: hashedPassword,
		username,
		image_url: imageResult,
	});
	try {
		const result = await newUser.save();
		const token = generateToken(newUser);

		const forFront = {
			email: result.email,
			username: result.username,
			_id: result._id,
			createdAt: result.createdAt,
			image_url: result.image_url,
		};
		res.status(200).json({result, token, user: forFront});
		console.log({result, token, user: forFront});
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
			console.log(error);
		} else {
			const result = await UserModel.findByIdAndUpdate(req.body._id, req.body, {
				new: true,
			});
			res.status(200).json(result);
		}
	} catch (e) {
		res.status(500).json({error: 'Something went wrong...'});
	}
};

const updatePassword = async (req, res) => {
	const {password: stringPassword, _id} = req.body;
	try {
		const hashedPassword = await encryptPassword(stringPassword);
		console.log(stringPassword, _id, hashedPassword);
		const result = await UserModel.findByIdAndUpdate(
			_id,
			{password: hashedPassword},
			{new: true}
		);
		res.status(200).json({message: 'password updated!'});
	} catch (error) {
		res.status(500).json({error: 'Something went wrong...'});
	}
};

const login = async (req, res) => {
	const {email, password} = req.body;
	try {
		const existingUser = await UserModel.findOne({email});
		if (!existingUser) {
			return res.status(404).json({error: 'No user with that email.'});
		}
		const verified = await verifyPassword(password, existingUser.password);
		if (!verified) {
			return res.status(401).json({error: "Password doesn't match."});
		}
		const token = generateToken(existingUser);
		const forFront = {
			email: existingUser.email,
			username: existingUser.username,
			_id: existingUser._id,
			createdAt: existingUser.createdAt,
			image_url: existingUser.image_url,
		};
		res.status(200).json({verified, token, user: forFront});
	} catch (error) {
		res.status(500).json({error: 'Something went wrong...'});
	}
};

const getMe = async (req, res) => {
	res.send('connected');
};

const logout = () => {
	localStorage.removeItem('token');
	setUser(null);
};

export {
	findAllUsers,
	findUserByEmail,
	createUser,
	updateUser,
	updatePassword,
	login,
	getMe,
	logout,
};
