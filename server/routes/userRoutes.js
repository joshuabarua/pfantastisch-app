import express from "express";
import {
	testRoute,
	findAllUsers,
	findUserByEmail,
	createUser,
	updateUser,
	middleTest,
} from "../controllers/userController.js";
import {multerUpload} from "../middlewares/multer.js";

const appRouter = express.Router();

appRouter.get("/test", middleTest, testRoute);
appRouter.get("/all", findAllUsers);

appRouter.get("/email/:email", findUserByEmail);
appRouter.post("/new", multerUpload.single("image_url"), createUser);
appRouter.put("/update", updateUser);

export default appRouter;
