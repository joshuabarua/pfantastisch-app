import 'dotenv/config';
import mongoose from 'mongoose';
import {createApp} from './app.js';

const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missing.length) {
	console.error(`Missing required environment variables: ${missing.join(', ')}`);
	process.exit(1);
}

const app = createApp();
const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`Connected to MongoDB, server running on port ${port}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

start();

export default app;
