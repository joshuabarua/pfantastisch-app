import express from "express";
import {
	testRoute,
	findAllUsers,
	findUserByEmail,
	createUser,
	updateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/test", testRoute);
userRouter.get("/all", findAllUsers);
userRouter.get("/email/:email", findUserByEmail);
userRouter.post("/new", createUser);
userRouter.put("/update", updateUser);

export default userRouter;
