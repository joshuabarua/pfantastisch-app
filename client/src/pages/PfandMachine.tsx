import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {styled} from '@mui/material/styles';
import {Button, TextField, Typography, CircularProgress} from '@mui/material';
import usePfandMachineFetch from '../hooks/usePfandMachineFetch';
import {useAuthStore} from '../context/AuthState';
import getToken from '../utils/getToken';
import CommentCard from '../components/CommentCard';
import commerce from '../assets/icons/commerce.png';

const PageContainer = styled('div')(({theme}) => ({
	width: '100%',
	padding: theme.spacing(2),
	overflow: 'auto',
}));

const ContentContainer = styled('div')(({theme}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(3),
	maxWidth: 800,
	margin: '0 auto',
}));

const MachineInfoContainer = styled('div')(({theme}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: theme.spacing(2),
	width: '100%',
}));

const ImageContainer = styled('div')({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 20,
});

const MachineImage = styled('img')({
	width: 200,
	height: 200,
	borderRadius: '10%',
	objectFit: 'cover',
});

const StatusIndicator = styled('span')<{isOperational: boolean}>(({theme, isOperational}) => ({
	color: isOperational ? theme.palette.success.main : theme.palette.error.main,
	animation: 'blink 2s linear infinite',
	'@keyframes blink': {
		'0%': {opacity: 0},
		'50%': {opacity: 1},
		'100%': {opacity: 0},
	},
}));

const CommentSection = styled('div')(({theme}) => ({
	width: '100%',
	maxWidth: 600,
	marginTop: theme.spacing(3),
}));

const CommentForm = styled('form')(({theme}) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	marginTop: theme.spacing(2),
}));

const StarRating = ({rating}: {rating: number}) => {
	return (
		<div>
			{[...Array(5)].map((_, index) => (
				<span key={index} style={{color: index < Math.round(rating) ? '#e6e628' : '#ccc'}}>
					★
				</span>
			))}
		</div>
	);
};

export default function PfandMachine() {
	const baseURL = import.meta.env.VITE_SERVER_BASE as string;
	const {user} = useAuthStore();
	const {_id} = useParams();
	const {pfandMachine, comments, setComments, loading} = usePfandMachineFetch(_id!);
	const [commentText, setCommentText] = useState('');

	const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const token = getToken();
		if (!token || !user || !_id) return;

		try {
			const response = await fetch(`${baseURL}api/businesses/add-comment/${_id}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({comment: commentText}),
			});

			const result = await response.json();
			const newComment = result.comments[result.comments.length - 1];

			setComments([
				...comments,
				{
					comment: newComment.comment,
					createdAt: newComment.createdAt,
					_id: newComment._id,
					likes: newComment.likes,
					posted_by: {
						username: user.username,
						_id: user._id,
						image_url: user.image_url,
					},
				},
			]);

			toast.success('Comment Posted');
			setCommentText('');
		} catch (error) {
			toast.error('Error posting comment');
			console.error(error);
		}
	};

	if (loading || !pfandMachine) {
		return (
			<PageContainer>
				<CircularProgress />
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<ContentContainer>
				<h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Pfand Automat</h1>
				<MachineInfoContainer>
					<ImageContainer>
						<MachineImage src={pfandMachine.image_url || commerce} alt={pfandMachine.name} />
						<div>
							<Typography variant="h5">{pfandMachine.name}</Typography>
							<StarRating rating={pfandMachine.rating} />
							<StatusIndicator isOperational={pfandMachine.pfandtastic.isOperational}>
								• {pfandMachine.pfandtastic.isOperational ? 'Pfandautomat Online' : 'Maintenance Needed'}
							</StatusIndicator>
						</div>
					</ImageContainer>
					<Typography>{`${pfandMachine.location.address1}, ${pfandMachine.location.city}, ${pfandMachine.location.zip_code}, ${pfandMachine.location.country}`}</Typography>
					{pfandMachine.phone && <Typography>Phone: {pfandMachine.phone}</Typography>}
				</MachineInfoContainer>
				<CommentSection>
					<Typography variant="h6">Comments:</Typography>
					{comments.length === 0 ? (
						<Typography align="center">No comments</Typography>
					) : (
						comments.map((comment) => <CommentCard key={comment._id} comment={comment} comments={comments} setComments={setComments} pfandmachine={pfandMachine} />)
					)}
					{user ? (
						<CommentForm onSubmit={handleSubmitComment}>
							<TextField label="Leave a comment" multiline rows={3} value={commentText} onChange={(e) => setCommentText(e.target.value)} fullWidth />
							<Button type="submit" variant="contained" color="primary">
								Post comment
							</Button>
						</CommentForm>
					) : (
						<Typography>Only logged in users can leave comments...</Typography>
					)}
				</CommentSection>
			</ContentContainer>
		</PageContainer>
	);
}
