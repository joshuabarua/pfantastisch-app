import multer from 'multer';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 5MB' : err.message;
		return res.status(400).json({error: message});
	}
	if (err.status && err.status < 500) {
		return res.status(err.status).json({error: err.message});
	}
	if (err.code === 11000) {
		return res.status(409).json({error: 'That email is already registered'});
	}
	console.error(err);
	return res.status(500).json({error: 'Something went wrong'});
};

export default errorHandler;
