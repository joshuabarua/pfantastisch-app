import multer from "multer";
import path from "path";

export const multerUpload = multer({
	storage: multer.diskStorage({}),
	fileFilter: (req, file, cb) => {
		let extension = path.extname(file.originalname);
		if (extension !== ".jpg" && extension !== ".jpeg" && extension !== ".png") {
			cb(new Error("File extension not supported"), false);
			return;
		}
		cb(null, true);
	},
});

export default multerUpload;
