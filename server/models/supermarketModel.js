import mongoose from 'mongoose';

const supermarketSchema = new mongoose.Schema(
	{
		id: String,
		alias: String,
		name: String,
		image_url: String,
		isClosed: Boolean,
		url: String,
		review_count: Number,
		categories: [{alias: String, title: String}],
		rating: Number,
		coordinates: {latitude: Number, longitude: Number},
		transactions: [],
		price: String,
		location: {
			address1: String,
			address2: String,
			address3: String,
			city: String,
			zip_code: String,
			country: String,
			state: String,
			display_address: [String],
		},
		phone: String,
		display_phone: String,
		distance: Number,
		pfandtastic: {
			has_pfand_automat: Boolean,
			isOperational: Boolean,
			machine_img_url: [String],
		},
		loc: {
			type: {
				type: String,
				enum: ['Point'],
			},
			coordinates: {
				type: [Number],
			},
		},
		comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}],
	},

	{timestamps: true}
);

//TODO: To add later for user interaction
// likes: Number,

export const supermarketModel = mongoose.model('supermarket', supermarketSchema);
