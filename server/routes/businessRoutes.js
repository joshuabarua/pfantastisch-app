import express from 'express';
import {findAllSupermarkets, findBusinesses, findSupermarketByAlias} from '../controllers/businessController.js';

const businessRouter = express.Router();

businessRouter.get('/all', findBusinesses);
businessRouter.get('/findAll', findAllSupermarkets);
businessRouter.get('/supermarketsByName/:alias', findSupermarketByAlias);

export default businessRouter;
