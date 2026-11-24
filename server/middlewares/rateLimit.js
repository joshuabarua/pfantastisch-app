import rateLimit from 'express-rate-limit';

/** Limits brute-force attempts against login and signup. */
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 20,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	message: {error: 'Too many attempts, please try again later.'},
});
