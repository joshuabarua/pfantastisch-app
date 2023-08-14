import express from "express";
import {
	testRoute,
	testRoute2,
	// findAllUsers,
	// findUserByEmail,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/test", testRoute);
userRouter.get("/testTwo", testRoute2);
// userRouter.get("/all", findAllUsers);
// userRouter.get("/email/:email", findUserByEmail);

export default userRouter;
