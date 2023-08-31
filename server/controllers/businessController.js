import {supermarketModel} from '../models/supermarketModel.js';

/*
TODO: 
- store all GROCERY store data in the database, including stores that might not have pfand machines,this can be checked against later if they do or not when a user adds a new pfand machine. If there is one already existing, update the pfand available field to (true) so it can bbbe used on the map. 
- Only display pfand machines that I know have machines (eg. rewe, edeka, lidle, kaufland, penny, aldi, netto, veganz, biocompany AKA have boolean value that says it does have one)
- Users need points, and only those with 5 drops off can register new machines (limited to 1), with every level they gain the ability to register a new machine. THOUGH, if it doesn not already exist in the db, thia needs to be checked manually)
*/

// TODO: Make a function to post this JSON data to the supermarkets collection rather than doing over mongodb

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
	const validSupermarkets = ['REWE', 'EDEKA', 'LIDL', 'KAUFLAND', 'ALDI', 'PENNY', 'NETTO'];

	try {
		const matchingSupermarkets = await supermarketModel.find({alias: {$in: validSupermarkets.map((alias) => new RegExp(alias, 'i'))}});

		if (matchingSupermarkets.length > 0) {
			const forFront = matchingSupermarkets.map((supermarket) => ({
				alias: supermarket.alias,
				name: supermarket.name,
				_id: supermarket._id,
				createdAt: supermarket.createdAt,
			}));
			res.status(200).json(forFront);
		} else {
			res.status(404).json({error: 'No matching supermarkets found'});
		}
	} catch (e) {
		res.status(500).json({error: 'Something went wrong'});
	}
};

const findAllSupermarkets = async (request, response) => {
	const supermarkets = await supermarketModel.find();
	try {
		if (supermarkets) {
			const forFront = [];
			supermarkets.forEach((supermarket) =>
				forFront.push({
					id: supermarket.id,
					alias: supermarket.alias,
					name: supermarket.name,
					image_url: supermarket.image_url,
					review_count: supermarket.review_count,
					rating: supermarket.rating,
					longtitude: supermarket.coordinates.longtitude,
					latitude: supermarket.coordinates.latitude,
					coordinates: supermarket.coordinates,
					display_address: supermarket.display_address,
					phone: supermarket.phone,
					distance: supermarket.distance,
					pfandtastic: supermarket.pfandtastic,
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

export {findBusinesses, findAllSupermarkets, findSupermarketByAlias};
