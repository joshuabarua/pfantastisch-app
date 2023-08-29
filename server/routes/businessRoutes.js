import express from 'express';
import {
	findAllSupermarkets,
	findBusinesses,
} from '../controllers/businessController.js';

const businessRouter = express.Router();

businessRouter.get('/all', findBusinesses);
businessRouter.get('/findAll', findAllSupermarkets);

export default businessRouter;
