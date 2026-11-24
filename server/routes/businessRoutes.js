import express from 'express';
import {findSupermarketById, findSupermarketsNearby, reportMachineStatus} from '../controllers/businessController.js';
import {addComment, deleteComment} from '../controllers/commentController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import {asyncHandler} from '../utils/httpError.js';

const businessRouter = express.Router();

businessRouter.get('/supermarketsWithPfandAutomat', asyncHandler(findSupermarketsNearby));
businessRouter.get('/supermarketById/:id', asyncHandler(findSupermarketById));

businessRouter.post('/supermarkets/:id/comments', jwtAuth, asyncHandler(addComment));
businessRouter.delete('/comments/:commentId', jwtAuth, asyncHandler(deleteComment));
businessRouter.patch('/supermarkets/:id/status', jwtAuth, asyncHandler(reportMachineStatus));

export default businessRouter;
