import {supermarketModel} from '../models/supermarketModel.js';

/*
TODO: 
- store all GROCERY store data in the database, including stores that might not have pfand machines,this can be checked against later if they do or not when a user adds a new pfand machine. If there is one already existing, update the pfand available field to (true) so it can bbbe used on the map. 
- Only display pfand machines that I know have machines (eg. rewe, edeka, lidle, kaufland, penny, aldi, netto, veganz, biocompany AKA have boolean value that says it does have one)
- Users need points, and only those with 5 drops off can register new machines (limited to 1), with every level they gain the ability to register a new machine. THOUGH, if it doesn not already exist in the db, thia needs to be checked manually)
*/

// TODO: Make a function to post this JSON data to the supermarkets collection rather than doing over mongodb

const validSupermarkets = ['REWE', 'EDEKA', 'LIDL', 'KAUFLAND', 'ALDI', 'PENNY', 'NETTO'];

const findBusinesses = async (req, res) => {
	try {
		const offset = req.query.offset || 0;
		const response = await fetch(`https://api.yelp.com/v3/businesses/search?offset=${offset}&limit=50&location=berlin&categories=grocery`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${process.env.YELP_API_TOKEN}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
		const result = await response.json();
		res.json(result);
	} catch (error) {
		res.status(500).json({error: 'An error occurred'});
	}
};

const findSupermarketByAlias = async (req, res) => {
	try {
		const matchingSupermarkets = await supermarketModel.find({alias: {$in: validSupermarkets.map((alias) => new RegExp(alias, 'i'))}});

		if (matchingSupermarkets.length > 0) {
			const forFront = matchingSupermarkets.map((supermarket) => ({
				_id: supermarket._id,
			}));
			res.status(200).json(forFront);
		} else {
			res.status(404).json({error: 'No matching supermarkets found'});
		}
	} catch (e) {
		res.status(500).json({error: 'Something went wrong'});
	}
};

const findSupermarketById = async (req, res) => {
	const {id} = req.params;
	console.log(id);
	if (id) {
		try {
			const foundSupermarket = await supermarketModel.findOne({_id: id}).populate('comments');
			if (foundSupermarket) {
				const forFront = {
					_id: foundSupermarket._id,
					alias: foundSupermarket.alias,
					name: foundSupermarket.name,
					image_url: foundSupermarket.image_url,
					review_count: foundSupermarket.review_count,
					rating: foundSupermarket.rating,
					longitude: foundSupermarket.coordinates.longitude,
					latitude: foundSupermarket.coordinates.latitude,
					coordinates: foundSupermarket.coordinates,
					display_address: foundSupermarket.location.display_address,
					location: foundSupermarket.location,
					phone: foundSupermarket.phone,
					distance: foundSupermarket.distance,
					pfandtastic: foundSupermarket.pfandtastic,
					comments: foundSupermarket.comments,
				};
				res.status(200).json(forFront);
			} else {
				res.status(404).json({error: 'No supermarket found'});
			}
		} catch (e) {
			res.status(500).json({error: 'Something went wrong'});
		}
	} else {
		res.status(400).json({error: 'valid ID must be included'});
	}
};

const findSupermarketByHasPfandAutomatValue = async (req, res) => {
	const longitude = req.query.longitude;
	const latitude = req.query.latitude;
	try {
		const matchingSupermarkets = await supermarketModel.find({
			'pfandtastic.has_pfand_automat': true,
			loc: {
				$near: {
					$geometry: {type: 'Point', coordinates: [longitude, latitude]},
					$minDistance: 1,
					$maxDistance: 900,
				},
			},
		});

		// console.log('Matching supermarkets:', matchingSupermarkets);
		// console.log(matchingSupermarkets);
		if (matchingSupermarkets.length > 0) {
			const forFront = matchingSupermarkets.map((supermarket) => ({
				_id: supermarket._id,
				alias: supermarket.alias,
				name: supermarket.name,
				image_url: supermarket.image_url,
				review_count: supermarket.review_count,
				rating: supermarket.rating,
				longitude: supermarket.coordinates.longitude,
				latitude: supermarket.coordinates.latitude,
				coordinates: supermarket.coordinates,
				display_address: supermarket.location.display_address,
				location: supermarket.location,
				phone: supermarket.phone,
				distance: supermarket.distance,
				pfandtastic: supermarket.pfandtastic,
				comments: supermarket.comments,
			}));
			res.status(200).json(forFront);
		} else {
			res.status(404).json({error: 'No matching supermarkets found'});
		}
	} catch (e) {
		res.status(500).json({error: 'Something went wrong'});
	}
};

const updateSupermarketsHasPfandVal = async (req, res) => {
	try {
		const idsToUpdate = req.body.map((item) => item._id);

		const supermarkets = await supermarketModel.find({_id: {$in: idsToUpdate}});

		if (!supermarkets.length) {
			return res.status(404).json({error: 'No matching supermarkets found'});
		}

		const updatedSupermarkets = await Promise.all(
			supermarkets.map(async (supermarket) => {
				const updatedSupermarket = await supermarketModel.findByIdAndUpdate(
					supermarket._id,
					{
						pfandtastic: {
							has_pfand_automat: true,
							isOperational: true,
						},
					},
					{new: true}
				);
				return updatedSupermarket;
			})
		);

		res.status(200).json(updatedSupermarkets);
	} catch (e) {
		res.status(500).json({error: 'Something went wrong...'});
	}
};

const findAllSupermarkets = async (request, response) => {
	const supermarkets = await supermarketModel.find();
	try {
		if (supermarkets) {
			const forFront = [];
			supermarkets.forEach((supermarket) =>
				forFront.push({
					_id: supermarket._id,
					id: supermarket.id,
					alias: supermarket.alias,
					name: supermarket.name,
					image_url: supermarket.image_url,
					review_count: supermarket.review_count,
					rating: supermarket.rating,
					longitude: supermarket.coordinates.longitude,
					latitude: supermarket.coordinates.latitude,
					coordinates: supermarket.coordinates,
					display_address: supermarket.display_address,
					phone: supermarket.phone,
					distance: supermarket.distance,
					pfandtastic: supermarket.pfandtastic,
					comments: supermarket.comments,
				})
			);
			response.status(200).json(forFront);
		} else {
			response.status(404).json({error: 'nothing in collection'});
		}
	} catch (e) {
		response.status(500).json({error: 'Something went wrong...'});
	}
};

/* Need to add geoJSON fields in order to correctly use leaflets $near methods for finding lcoations near user */
async function updateSupermarketsWithField() {
	try {
		const supermarkets = await supermarketModel.find();

		if (!supermarkets.length) {
			console.log('No supermarkets found in the collection.');
			return;
		}

		const bulkOps = supermarkets.map((supermarket) => ({
			updateOne: {
				filter: {_id: supermarket._id},
				update: {
					$set: {
						comments: [],
					},
				},
			},
		}));

		await supermarketModel.bulkWrite(bulkOps);
		console.log(`${supermarkets.length} documents updated with comments field.`);
	} catch (error) {
		console.error('Error updating documents:', error);
	}
}

export {
	findBusinesses,
	findAllSupermarkets,
	findSupermarketByAlias,
	findSupermarketById,
	updateSupermarketsHasPfandVal,
	findSupermarketByHasPfandAutomatValue,
	updateSupermarketsWithField,
};
