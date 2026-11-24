import {useState} from 'react';
import {toast} from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {useAuthStore} from '../context/AuthState';
import {Comment} from '../@types';
import {api, errorMessage} from '../utils/api';

interface Props {
	comment: Comment;
	onDeleted: (commentId: string) => void;
}

function CommentCard({comment, onDeleted}: Props) {
	const user = useAuthStore((s) => s.user);
	const [deleting, setDeleting] = useState(false);
	const author = comment.posted_by;
	const isOwnComment = Boolean(user && author && user._id === author._id);

	const deleteComment = async () => {
		if (!window.confirm('Delete this comment?')) return;
		setDeleting(true);
		try {
			await api(`/api/businesses/comments/${comment._id}`, {method: 'DELETE', auth: true});
			onDeleted(comment._id);
			toast.success('Comment deleted');
		} catch (e) {
			toast.error(`Couldn't delete comment - ${errorMessage(e)}`);
			setDeleting(false);
		}
	};

	return (
		<Card sx={{width: '100%', marginBottom: 1}}>
			<CardContent>
				<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
					<Avatar src={author?.image_url} alt={author?.username} sx={{width: 32, height: 32}} />
					<Typography variant="subtitle1" sx={{fontWeight: 'bold', flex: 1}}>
						{author?.username ?? 'Deleted user'}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						{new Date(comment.createdAt).toLocaleDateString()}
					</Typography>
					{isOwnComment && (
						<IconButton color="error" size="small" onClick={deleteComment} disabled={deleting} aria-label="Delete comment">
							<DeleteIcon fontSize="small" />
						</IconButton>
					)}
				</div>
				<Typography variant="body2" sx={{marginTop: 1, whiteSpace: 'pre-wrap'}}>
					{comment.comment}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default CommentCard;
