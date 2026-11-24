import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {styled} from '@mui/material/styles';
import {Button, TextField, Typography, CircularProgress} from '@mui/material';
import usePfandMachineFetch from '../hooks/usePfandMachineFetch';
import {useAuthStore} from '../context/AuthState';
import CommentCard from '../components/CommentCard';
import {Comment, Pfandtastic} from '../@types';
import {api, errorMessage} from '../utils/api';
import StoreImage from '../components/StoreImage';

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

const StatusIndicator = styled('span', {shouldForwardProp: (prop) => prop !== 'isOperational'})<{isOperational: boolean}>(({theme, isOperational}) => ({
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

const MAX_COMMENT_LENGTH = 1000;

export default function PfandMachine() {
	const user = useAuthStore((s) => s.user);
	const {_id} = useParams();
	const {pfandMachine, setPfandMachine, comments, setComments, loading, error} = usePfandMachineFetch(_id);
	const [commentText, setCommentText] = useState('');
	const [posting, setPosting] = useState(false);
	const [reporting, setReporting] = useState(false);

	const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!_id || !commentText.trim()) return;
		setPosting(true);
		try {
			const result = await api<{comment: Comment}>(`/api/businesses/supermarkets/${_id}/comments`, {
				method: 'POST',
				body: {comment: commentText},
				auth: true,
			});
			setComments((prev) => [...prev, result.comment]);
			setCommentText('');
			toast.success('Comment posted');
		} catch (error) {
			toast.error(`Error posting comment - ${errorMessage(error)}`);
		} finally {
			setPosting(false);
		}
	};

	const reportStatus = async (isOperational: boolean) => {
		if (!_id || !pfandMachine) return;
		setReporting(true);
		try {
			const result = await api<{pfandtastic: Pfandtastic}>(`/api/businesses/supermarkets/${_id}/status`, {
				method: 'PATCH',
				body: {isOperational},
				auth: true,
			});
			setPfandMachine({...pfandMachine, pfandtastic: result.pfandtastic});
			toast.success('Thanks for the update!');
		} catch (error) {
			toast.error(`Couldn't report status - ${errorMessage(error)}`);
		} finally {
			setReporting(false);
		}
	};

	if (error) {
		return (
			<PageContainer>
				<ContentContainer>
					<Typography variant="h6">Couldn't load this pfand machine</Typography>
					<Typography>{error}</Typography>
				</ContentContainer>
			</PageContainer>
		);
	}

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
						<StoreImage src={pfandMachine.image_url} alt={pfandMachine.name} size={200} borderRadius="10%" />
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
					{pfandMachine.pfandtastic.status_updated_at && (
						<Typography variant="caption" color="text.secondary">
							Status last reported {new Date(pfandMachine.pfandtastic.status_updated_at).toLocaleString()}
						</Typography>
					)}
					{user && (
						<div style={{display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center'}}>
							<Typography sx={{width: '100%', textAlign: 'center'}}>Were you just there? Let others know:</Typography>
							<Button variant="outlined" color="success" disabled={reporting} onClick={() => reportStatus(true)}>
								It's working
							</Button>
							<Button variant="outlined" color="error" disabled={reporting} onClick={() => reportStatus(false)}>
								It's broken
							</Button>
						</div>
					)}
				</MachineInfoContainer>
				<CommentSection>
					<Typography variant="h6">Comments:</Typography>
					{comments.length === 0 ? (
						<Typography align="center">No comments</Typography>
					) : (
						comments.map((comment) => (
							<CommentCard key={comment._id} comment={comment} onDeleted={(id) => setComments((prev) => prev.filter((c) => c._id !== id))} />
						))
					)}
					{user ? (
						<CommentForm onSubmit={handleSubmitComment}>
							<TextField
								label="Leave a comment"
								multiline
								rows={3}
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								inputProps={{maxLength: MAX_COMMENT_LENGTH}}
								helperText={`${commentText.length}/${MAX_COMMENT_LENGTH}`}
								fullWidth
							/>
							<Button type="submit" variant="contained" color="primary" disabled={posting || !commentText.trim()}>
								{posting ? 'Posting...' : 'Post comment'}
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
