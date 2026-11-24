import {commentModel} from '../models/commentModel.js';
import {supermarketModel} from '../models/supermarketModel.js';
import {userModel} from '../models/userModel.js';
import {HttpError} from '../utils/httpError.js';
import {serializeComment} from '../utils/serializers.js';
import {assertObjectId} from './businessController.js';

const MAX_COMMENT_LENGTH = 1000;

const addComment = async (req, res) => {
	const {id} = req.params;
	assertObjectId(id);

	const text = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';
	if (!text) throw new HttpError(400, 'Comment cannot be empty');
	if (text.length > MAX_COMMENT_LENGTH) throw new HttpError(400, `Comments are limited to ${MAX_COMMENT_LENGTH} characters`);

	if (!(await supermarketModel.exists({_id: id}))) throw new HttpError(404, 'No supermarket found');

	const createdComment = await commentModel.create({comment: text, posted_by: req.user._id, supermarket: id});
	await Promise.all([
		supermarketModel.updateOne({_id: id}, {$push: {comments: createdComment._id}}),
		userModel.updateOne({_id: req.user._id}, {$push: {comments: createdComment._id}}),
	]);

	createdComment.posted_by = req.user;
	res.status(201).json({comment: serializeComment(createdComment)});
};

/** Deletes a comment. Only its author may delete it. */
const deleteComment = async (req, res) => {
	const {commentId} = req.params;
	assertObjectId(commentId, 'comment ID');

	const comment = await commentModel.findById(commentId);
	if (!comment) throw new HttpError(404, 'Comment not found');
	if (!comment.posted_by.equals(req.user._id)) throw new HttpError(403, 'You can only delete your own comments');

	await Promise.all([
		commentModel.deleteOne({_id: commentId}),
		supermarketModel.updateOne({_id: comment.supermarket}, {$pull: {comments: comment._id}}),
		userModel.updateOne({_id: comment.posted_by}, {$pull: {comments: comment._id}}),
	]);

	res.status(200).json({message: 'Comment deleted'});
};

export {addComment, deleteComment};
