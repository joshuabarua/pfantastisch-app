import {UserModel} from '../models/userModel.js';

// TODO: Make a function to post this JSON data to the supermarkets collection rather than doing over mongodb

const findBusinesses = async (req, res) => {
	try {
		const offset = req.query.offset || 0;
		const response = await fetch(
			`https://api.yelp.com/v3/businesses/search?offset=${offset}&limit=50&location=berlin&categories=grocery`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${process.env.YELP_API_TOKEN}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
		const result = await response.json();
		res.json(result);
	} catch (error) {
		res.status(500).json({error: 'An error occurred'});
	}
};

export {findBusinesses};
