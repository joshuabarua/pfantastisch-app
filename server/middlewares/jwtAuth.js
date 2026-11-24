import passport from 'passport';

/** Requires a valid Bearer token; sets req.user or responds 401 with JSON. */
const jwtAuth = (req, res, next) => {
	passport.authenticate('jwt', {session: false}, (err, user) => {
		if (err) return next(err);
		if (!user) return res.status(401).json({error: 'You need to be logged in to do that.'});
		req.user = user;
		return next();
	})(req, res, next);
};

export default jwtAuth;
