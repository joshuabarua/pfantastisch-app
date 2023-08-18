import mongoose from "mongoose";

const groceryStoreSchema = new mongoose.Schema(
	{
		alias: String,
		name: String,
		image_url: String,
		coordinates: {latitude: Number, longtitude: Number},
		location: {
			address1: String,
			city: String,
			zip_code: String,
			country: String,
			state: String,
			display_address: [String],
		},
		phone: String,
		review_count: Number,
		rating: Number,
		has_pfand_automats: Boolean,
		pfand_automat_operational: Boolean,
		comments: [{type: ObjectId, ref: "Comment"}],
		likes: [String],
	},
	{timestamps: true}
);

export const GroceryStoreModel = mongoose.model("groceryStore", groceryStoreSchema);
