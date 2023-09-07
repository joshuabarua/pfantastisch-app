import React, {SetStateAction, useContext} from 'react';
import getToken from '../utils/getToken';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {AuthContext} from '../context/AuthContext.js';
import {Comment, Comments, Supermarket} from '../@types/index.js';
// import SeeUserLink from './SeeUserLink';
// import {baseURL} from '../utils/getServerURL';

interface Props {
	comment: Comment;
	comments: Comments;
	setComments: React.Dispatch<SetStateAction<Comments>>;
	pfandmachine: Supermarket;
}

function CommentCard({comment, comments, setComments, pfandmachine}: Props) {
	const {user} = useContext(AuthContext);
	const baseURL = import.meta.env.VITE_SERVER_BASE as string;

	const deleteComment = async () => {
		const token = getToken();
		if (token) {
			try {
				const myHeaders = new Headers();
				myHeaders.append('Authorization', 'Bearer ' + token);
				myHeaders.append('Content-Type', 'application/json');
				const body = JSON.stringify({comment: comment.comment, posted_by: comment.posted_by});
				const reqOptions = {
					method: 'PATCH',
					headers: myHeaders,
					body: body,
				};
				const response = await fetch(baseURL + '/api/recipes/delete-comment/' + pfandmachine._id, reqOptions);
				const result = await response.json();
				console.log(result);
				setComments(comments.filter((item) => item._id !== comment._id));
			} catch (error) {
				console.error(error);
				alert('It clings to existence. Try again?');
			}
		}
	};
	console.log(user?._id, comment._id);
	return (
		<Card sx={{width: '100%', marginBottom: 1}}>
			<CardContent>
				<Typography variant='h6' component='div' sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					{/* <SeeUserLink user={comment.posted_by} /> */}
				</Typography>
				<Typography variant='subtitle2' color='black' gutterBottom>
					{new Date(comment.createdAt).toDateString().substring(4)}
					{user && (
						<>
							{user._id === comment.posted_by._id && (
								<IconButton color='error' size='small' onClick={deleteComment}>
									<DeleteIcon sx={{fontSize: 'large'}} />
								</IconButton>
							)}
						</>
					)}
				</Typography>
				<Typography variant='body2' color='black'>
					{comment.comment}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default CommentCard;
