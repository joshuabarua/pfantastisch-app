import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import businessRouter from './routes/businessRoutes.js';

import * as dotenv from 'dotenv';
import configurePassport from './config/passportConfig.js';
import configureCloudinary from './config/cloudinaryConfig.js';
dotenv.config();

// console.log("MONGO URI", process.env.MONGO_URI);

const app = express();
const port = process.env.PORT || 5000;

const connectMiddlewares = () => {
	app.use(express.json());
	app.use(
		express.urlencoded({
			extended: true,
		})
	);
	app.use(
		cors({
			origin: 'https://pfandtastisch-app.vercel.app/map',
		})
	);
	configureCloudinary();
	configurePassport();
};

const connectDatabase = async () => {
	await mongoose.connect(process.env.MONGO_URI);
	app.listen(port, () => {
		console.log('Connection to MongoDB established, and server is running on port ' + port);
	});
};

const defineRoutes = () => {
	app.use('/api/users', userRouter);
	app.use('/api/businesses', businessRouter);
	app.use('*', (req, res) => res.status(404).json({error: 'Endpoint not found.'}));
};

connectMiddlewares();
defineRoutes();
connectDatabase();
