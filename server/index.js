import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import * as dotenv from "dotenv";
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
	app.use(cors());
};

const connectDatabase = async () => {
	await mongoose.connect(process.env.MONGO_URI);
	app.listen(port, () => {
		console.log(
			"Connection to MongoDB established, and server is running on port " + port
		);
	});
};

const defineRoutes = () => {
	app.use("/api/users", userRouter);
	app.use("*", (req, res) => res.status(404).json({error: "Endpoint not found."}));
};

app.use("/api/users", userRouter);
app.use("*", (req, res) => res.status(404).json({error: "Endpoint not found"}));

connectMiddlewares();
defineRoutes();
connectDatabase();
