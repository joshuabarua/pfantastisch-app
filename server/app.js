import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRouter from './routes/userRoutes.js';
import businessRouter from './routes/businessRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import configurePassport from './config/passportConfig.js';
import configureCloudinary from './config/cloudinaryConfig.js';

// Used when CLIENT_ORIGIN is not set.
const DEFAULT_ORIGINS = ['https://pfandtastisch-app.vercel.app', 'http://localhost:5173'];

const allowedOrigins = () =>
	(process.env.CLIENT_ORIGIN || '')
		.split(',')
		.map((origin) => origin.trim().replace(/\/+$/, ''))
		.filter(Boolean);

export const createApp = () => {
	const app = express();
	const origins = allowedOrigins();

	// Behind Vercel's proxy; needed so rate limiting sees the real client IP.
	app.set('trust proxy', 1);
	app.use(helmet());
	app.use(cors({origin: origins.length ? origins : DEFAULT_ORIGINS}));
	app.use(express.json({limit: '100kb'}));
	app.use(express.urlencoded({extended: true, limit: '100kb'}));

	configureCloudinary();
	configurePassport();

	app.use('/api/users', userRouter);
	app.use('/api/businesses', businessRouter);
	app.use('*', (req, res) => res.status(404).json({error: 'Endpoint not found.'}));
	app.use(errorHandler);

	return app;
};

export default createApp;
