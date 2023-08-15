import express from "express";
import {
	testRoute,
	findAllUsers,
	findUserByEmail,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/test", testRoute);
userRouter.get("/all", findAllUsers);
userRouter.get("/email/:email", findUserByEmail);

export default userRouter;
