import multer from 'multer';
import path from 'path';
import {HttpError} from '../utils/httpError.js';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const multerUpload = multer({
	storage: multer.diskStorage({}),
	limits: {fileSize: 5 * 1024 * 1024},
	fileFilter: (req, file, cb) => {
		const extension = path.extname(file.originalname).toLowerCase();
		if (!ALLOWED_EXTENSIONS.includes(extension)) {
			cb(new HttpError(400, 'Only .jpg, .jpeg and .png images are supported'), false);
			return;
		}
		cb(null, true);
	},
});

export default multerUpload;
