import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
	const payload = {sub: user._id.toString()};
	return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});
};
