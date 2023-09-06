import mongoose from 'mongoose';

const {Schema} = mongoose;

const commentSchema = new Schema(
	{
		comment: String,
		likes: [String],
		posted_by: [{type: Schema.Types.ObjectId, ref: 'user'}],
		date: String,
	},
	{timestamps: true}
);

export const commentModel = mongoose.model('comment', commentSchema);
