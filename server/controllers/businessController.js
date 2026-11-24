import mongoose from 'mongoose';
import {supermarketModel} from '../models/supermarketModel.js';
import {HttpError} from '../utils/httpError.js';
import {serializeSupermarket} from '../utils/serializers.js';

/*
TODO (product ideas):
- Store all grocery stores, and flip pfandtastic.has_pfand_automat when users confirm a machine exists.
- Points system: users with enough drop-offs can register new machines, verified manually if not already in the db.
*/

export const DEFAULT_RADIUS_METERS = 900;
export const MAX_RADIUS_METERS = 10000;

const parseCoordinate = (value, min, max, name) => {
	const number = Number(value);
	if (value === undefined || value === '' || !Number.isFinite(number) || number < min || number > max) {
		throw new HttpError(400, `A valid ${name} is required`);
	}
	return number;
};

export const assertObjectId = (id, label = 'ID') => {
	if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpError(400, `Invalid ${label}`);
};

const findSupermarketById = async (req, res) => {
	const {id} = req.params;
	assertObjectId(id);

	const foundSupermarket = await supermarketModel.findById(id).populate({
		path: 'comments',
		options: {sort: {createdAt: 1}},
		populate: {path: 'posted_by', select: 'username image_url'},
	});
	if (!foundSupermarket) throw new HttpError(404, 'No supermarket found');

	res.status(200).json(serializeSupermarket(foundSupermarket));
};

/** Supermarkets with a pfand machine near the given point. Returns [] (not 404) when there are none. */
const findSupermarketsNearby = async (req, res) => {
	const longitude = parseCoordinate(req.query.longitude, -180, 180, 'longitude');
	const latitude = parseCoordinate(req.query.latitude, -90, 90, 'latitude');
	const radius = req.query.radius === undefined ? DEFAULT_RADIUS_METERS : parseCoordinate(req.query.radius, 1, MAX_RADIUS_METERS, 'radius');

	const matchingSupermarkets = await supermarketModel.find({
		'pfandtastic.has_pfand_automat': true,
		loc: {
			$near: {
				$geometry: {type: 'Point', coordinates: [longitude, latitude]},
				$maxDistance: radius,
			},
		},
	});

	res.status(200).json(matchingSupermarkets.map(serializeSupermarket));
};

/** Lets a logged-in user report whether a machine is currently working. */
const reportMachineStatus = async (req, res) => {
	const {id} = req.params;
	assertObjectId(id);
	if (typeof req.body.isOperational !== 'boolean') throw new HttpError(400, 'isOperational must be true or false');

	const updated = await supermarketModel.findOneAndUpdate(
		{_id: id, 'pfandtastic.has_pfand_automat': true},
		{
			$set: {
				'pfandtastic.isOperational': req.body.isOperational,
				'pfandtastic.status_updated_at': new Date(),
				'pfandtastic.status_updated_by': req.user._id,
			},
		},
		{new: true}
	);
	if (!updated) throw new HttpError(404, 'No pfand machine found');

	res.status(200).json({pfandtastic: updated.pfandtastic});
};

export {findSupermarketById, findSupermarketsNearby, reportMachineStatus};
