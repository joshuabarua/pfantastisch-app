import express from 'express';
import {
	findAllSupermarkets,
	findBusinesses,
	findSupermarketByAlias,
	findSupermarketById,
	updateSupermarketsHasPfandVal,
	findSupermarketByHasPfandAutomatValue,
	updateSupermarketsWithField,
} from '../controllers/businessController.js';
import {addComment} from '../controllers/commentController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

const businessRouter = express.Router();

businessRouter.post('/add-comment/:_id', jwtAuth, addComment);

businessRouter.get('/all', findBusinesses);
businessRouter.get('/findAll', findAllSupermarkets);
businessRouter.get('/supermarketsByName/', findSupermarketByAlias);
businessRouter.get('/supermarketsWithPfandAutomat', findSupermarketByHasPfandAutomatValue);
businessRouter.get('/supermarketById/:id', findSupermarketById);

businessRouter.put('/updateSupermarketsWithTruthy/', updateSupermarketsHasPfandVal);
businessRouter.put('/updateSupermarketsWithField/', updateSupermarketsWithField);

export default businessRouter;
