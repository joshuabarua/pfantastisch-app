import mongoose from 'mongoose';

const {Schema} = mongoose;

const commentSchema = new Schema(
	{
		comment: String,
		likes: [{type: Schema.Types.ObjectId, ref: 'user'}],
		posted_by: {type: Schema.Types.ObjectId, ref: 'user'},
		supermarket: {type: Schema.Types.ObjectId, ref: 'supermarket'},
	},
	{timestamps: true}
);

export const commentModel = mongoose.model('comment', commentSchema);
