import {supermarketModel} from '../models/supermarketModel.js';

const addComment = async (req, res) => {
	const pfandMachineId = req.params._id;
	if (!mongoose.Types.ObjectId.isValid(pfandMachineId)) {
		return res.status(406).json({error: 'Invalid ID'});
	}
	try {
		const toSubmit = {...req.body, posted_by: req.user._id};
		const pfandMachine = await supermarketModel.findOneAndUpdate(
			{_id: pfandMachineId},
			{
				$push: {comments: toSubmit},
			},
			{new: true}
		);
		if (!pfandMachine) {
			return res.status(404).json({error: 'ID not found.'});
		}
		return res.status(200).json(pfandMachine);
	} catch (error) {
		return res.status(500).json({error: error});
	}
};

// const deleteComment = async (req, res) => {
// 	const pfandMachineId = req.params.id;
// 	if (!mongoose.Types.ObjectId.isValid(pfandMachineId)) {
// 		return res.status(406).json({error: 'Invalid ID'});
// 	}

// 	try {
// 		const pfandMachine = await supermarketModel.updateOne(
// 			{_id: pfandMachineId},
// 			{
// 				$pull: {comments: {_id: req.body.comment._id}},
// 			},
// 			{new: true}
// 		);
// 		if (!pfandMachine) {
// 			return res.status(404).json({error: 'ID not found.'});
// 		}
// 		return res.status(200).json({message: 'Comment deleted'});
// 	} catch (error) {
// 		return res.status(500).json({error: error});
// 	}
// };

export {addComment};
