import express from 'express';
import {findBusinesses} from '../controllers/businessController.js';

const businessRouter = express.Router();

businessRouter.get('/all', findBusinesses);

export default businessRouter;
