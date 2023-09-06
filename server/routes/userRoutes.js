import express from 'express';
import {findAllUsers, findUserByEmail, createUser, updateUser, login, getMe, updatePassword, updateUserFields} from '../controllers/userController.js';
import multerUpload from '../middlewares/multer.js';
import jwtAuth from '../middlewares/jwtAuth.js';

const userRouter = express.Router();

// userRouter.get('/test', middleTest, testRoute);
userRouter.get('/all', findAllUsers);
userRouter.get('/email/:email', findUserByEmail);
userRouter.get('/me', jwtAuth, getMe);

userRouter.post('/new', multerUpload.single('image_url'), createUser);
userRouter.post('/login', login);

userRouter.put('/updateUser', multerUpload.single('image_url'), updateUser);
userRouter.put('/updatePassword', updatePassword);

//Add  any new fields i need to the collection in bulk
userRouter.post('/addFieldsToUsers', updateUserFields);

export default userRouter;
