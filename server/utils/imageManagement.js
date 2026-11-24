import fs from 'fs/promises';
import {v2 as cloudinary} from 'cloudinary';

/** Uploads a multer temp file to Cloudinary, always removing the temp file afterwards. Returns the secure URL or undefined. */
export const imageUpload = async (file, folder) => {
	if (!file) return undefined;
	try {
		const result = await cloudinary.uploader.upload(file.path, {folder});
		return result.secure_url;
	} catch (e) {
		console.error('Cloudinary upload failed:', e.message);
		return undefined;
	} finally {
		await fs.unlink(file.path).catch(() => {});
	}
};

/** Removes a multer temp file that will not be uploaded. */
export const discardUpload = async (file) => {
	if (file?.path) await fs.unlink(file.path).catch(() => {});
};

export default imageUpload;
