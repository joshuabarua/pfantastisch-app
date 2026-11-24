import mongoose from 'mongoose';

const {Schema} = mongoose;

const commentSchema = new Schema(
	{
		comment: {type: String, required: true, trim: true, maxlength: 1000},
		likes: [{type: Schema.Types.ObjectId, ref: 'user'}],
		posted_by: {type: Schema.Types.ObjectId, ref: 'user', required: true},
		supermarket: {type: Schema.Types.ObjectId, ref: 'supermarket', required: true},
	},
	{timestamps: true}
);

export const commentModel = mongoose.model('comment', commentSchema);
