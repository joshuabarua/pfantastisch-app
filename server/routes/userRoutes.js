import express from 'express';
import {createUser, login, getMe, updateMe} from '../controllers/userController.js';
import multerUpload from '../middlewares/multer.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import {authLimiter} from '../middlewares/rateLimit.js';
import {asyncHandler} from '../utils/httpError.js';

const userRouter = express.Router();

userRouter.post('/new', authLimiter, multerUpload.single('image_url'), asyncHandler(createUser));
userRouter.post('/login', authLimiter, asyncHandler(login));

userRouter.get('/me', jwtAuth, asyncHandler(getMe));
userRouter.patch('/me', jwtAuth, multerUpload.single('image_url'), asyncHandler(updateMe));

export default userRouter;
