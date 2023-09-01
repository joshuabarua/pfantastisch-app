import express from 'express';
import {
	findAllSupermarkets,
	findBusinesses,
	findSupermarketByAlias,
	updateSupermarketsHasPfandVal,
	findSupermarketByHasPfandAutomatValue,
	updateSupermarketsWithGeoJSON,
} from '../controllers/businessController.js';

const businessRouter = express.Router();

businessRouter.get('/all', findBusinesses);
businessRouter.get('/findAll', findAllSupermarkets);
businessRouter.get('/supermarketsByName/', findSupermarketByAlias);
businessRouter.get('/supermarketsWithPfandAutomat', findSupermarketByHasPfandAutomatValue);

businessRouter.put('/updateSupermarketsWithTruthy/', updateSupermarketsHasPfandVal);
businessRouter.put('/updateSupermarketsWithGeoJSON/', updateSupermarketsWithGeoJSON);

export default businessRouter;
