import {userModel} from '../models/userModel.js';
import {encryptPassword, verifyPassword} from '../utils/bcrypt.js';
import {imageUpload, discardUpload} from '../utils/imageManagement.js';
import {generateToken} from '../utils/jwt.js';
import {HttpError} from '../utils/httpError.js';
import {serializeUser} from '../utils/serializers.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Matches the rule shown in the client: min 6 chars, at least one number, one lowercase and one uppercase letter.
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const PASSWORD_RULE = 'Password must be at least 6 characters and include a number, a lowercase and an uppercase letter.';

const asTrimmedString = (value) => (typeof value === 'string' ? value.trim() : '');

const createUser = async (req, res) => {
	const email = asTrimmedString(req.body.email);
	const username = asTrimmedString(req.body.username);
	const password = typeof req.body.password === 'string' ? req.body.password : '';

	try {
		if (!email || !password || !username) throw new HttpError(400, 'Please fill out all fields');
		if (!EMAIL_REGEX.test(email)) throw new HttpError(400, 'Please enter a valid email address');
		if (!PASSWORD_REGEX.test(password)) throw new HttpError(400, PASSWORD_RULE);
		if (await userModel.exists({email})) throw new HttpError(409, 'That email is already registered');
	} catch (err) {
		await discardUpload(req.file);
		throw err;
	}

	const image_url = await imageUpload(req.file, 'profile_pics');
	const newUser = await userModel.create({
		email,
		username,
		password: await encryptPassword(password),
		...(image_url && {image_url}),
	});

	res.status(201).json({token: generateToken(newUser), user: serializeUser(newUser)});
};

const login = async (req, res) => {
	const email = asTrimmedString(req.body.email);
	const password = typeof req.body.password === 'string' ? req.body.password : '';
	// Same response for unknown email and wrong password, so accounts can't be enumerated.
	const invalid = new HttpError(401, 'Invalid email or password');

	if (!email || !password) throw invalid;
	const existingUser = await userModel.findOne({email}).select('+password');
	if (!existingUser || !(await verifyPassword(password, existingUser.password))) throw invalid;

	res.status(200).json({token: generateToken(existingUser), user: serializeUser(existingUser)});
};

const getMe = async (req, res) => {
	res.status(200).json(serializeUser(req.user));
};

/** Updates the logged-in user. Changing the password requires the current password. */
const updateMe = async (req, res) => {
	const updates = {};
	try {
		const username = asTrimmedString(req.body.username);
		const email = asTrimmedString(req.body.email);
		const password = typeof req.body.password === 'string' ? req.body.password : '';

		if (username) updates.username = username;

		if (email && email !== req.user.email) {
			if (!EMAIL_REGEX.test(email)) throw new HttpError(400, 'Please enter a valid email address');
			if (await userModel.exists({email, _id: {$ne: req.user._id}})) throw new HttpError(409, 'That email is already registered');
			updates.email = email;
		}

		if (password) {
			if (!PASSWORD_REGEX.test(password)) throw new HttpError(400, PASSWORD_RULE);
			const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
			const withPassword = await userModel.findById(req.user._id).select('+password');
			if (!currentPassword || !(await verifyPassword(currentPassword, withPassword.password))) {
				throw new HttpError(401, 'Current password is incorrect');
			}
			updates.password = await encryptPassword(password);
		}
	} catch (err) {
		await discardUpload(req.file);
		throw err;
	}

	if (req.file) {
		const image_url = await imageUpload(req.file, 'profile_pics');
		if (!image_url) throw new HttpError(502, 'Profile picture upload failed, please try again');
		updates.image_url = image_url;
	}

	if (Object.keys(updates).length === 0) throw new HttpError(400, 'Nothing to update');

	const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {$set: updates}, {new: true, runValidators: true});
	res.status(200).json({user: serializeUser(updatedUser)});
};

export {createUser, login, getMe, updateMe};
