import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {userModel} from '../models/userModel.js';

const callback = async (jwtPayload, done) => {
	try {
		const foundUser = await userModel.findById(jwtPayload.sub);
		return done(null, foundUser || false);
	} catch (err) {
		return done(err, false);
	}
};

const configurePassport = () => {
	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.JWT_SECRET,
			},
			callback
		)
	);
};

export default configurePassport;
