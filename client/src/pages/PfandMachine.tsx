import {useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import usePfandMachineFetch from '../hooks/usePfandMachineFetch';
import {AuthContext} from '../context/AuthContext';
import Button from '@mui/material/Button/Button';
import getToken from '../utils/getToken';
import CommentCard from '../components/CommentCard';
import bottleAutomat from '/assets/imgs/bottle-automat.png';
import commerce from '/assets/icons/commerce.png';

export default function PfandMachine() {
	const baseURL = import.meta.env.VITE_SERVER_BASE as string;
	const {user} = useContext(AuthContext);
	const {_id} = useParams();
	const {pfandMachine, comments, setComments, loading} = usePfandMachineFetch(_id!);
	const [commentText, setCommentText] = useState('');
	const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const token = getToken();
		if (token && user && _id) {
			try {
				const myHeaders = new Headers();
				myHeaders.append('Authorization', 'Bearer ' + token);
				myHeaders.append('Content-Type', 'application/json');
				const body = JSON.stringify({comment: commentText});
				const reqOptions = {
					method: 'POST',
					headers: myHeaders,
					body: body,
				};

				const response = await fetch(baseURL + `api/businesses/add-comment/` + _id, reqOptions);
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

				toast.success('Comment Posted', result);
				setCommentText('');
			} catch (error) {
				toast.error('error!');
				console.log(error);
			}
		}
	};

	function renderStars(rating: number) {
		const maxStars = 5; // You can change this value to determine the maximum number of stars
		const roundedRating = Math.round(rating); // Round the rating to the nearest whole number
		const stars = [];

		for (let i = 1; i <= maxStars; i++) {
			if (i <= roundedRating) {
				stars.push(
					<span key={i} style={{color: '#e6e628'}}>
						&#9733;
					</span>
				);
			}
		}

		return stars;
	}

	return (
		<div style={{width: '100vw', padding: '10px', overflow: 'auto'}}>
			<div className="centeredDiv" style={{justifyContent: 'flex-start', flexDirection: 'column', backgroundColor: 'whitesmoke', borderRadius: '25px'}}>
				<h1>Pfand Automat</h1>
				{loading || !pfandMachine ? (
					<p>Loading...</p>
				) : (
					<div className="centeredDiv" style={{flexDirection: 'column', width: '50vw', gap: 20}}>
						<div className="centeredDiv" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '40vw', gap: 10}}>
							<img src={!pfandMachine.image_url ? commerce : pfandMachine.image_url} style={{width: '200px', height: '200px', borderRadius: '10%'}} />
							<div className="centeredDiv" style={{flexDirection: 'column', gap: 5}}>
								<span>
									<h3> {pfandMachine.name}</h3>
									{renderStars(pfandMachine.rating)}
								</span>
								{pfandMachine.pfandtastic.isOperational ? (
									<span className="blink" style={{color: '#81c784'}}>
										• Pfandautomat Online{' '}
									</span>
								) : (
									<span className="blink" style={{color: '#e57373'}}>
										• Maintainence Needed{' '}
									</span>
								)}
							</div>
						</div>
						<div className="centeredDiv" style={{flexDirection: 'column', gap: 20}}>
							<span> {`${pfandMachine.location.address1}, ${pfandMachine.location.city}, ${pfandMachine.location.zip_code}, ${pfandMachine.location.country}`}</span>
							{pfandMachine.phone && <span>Phone: {pfandMachine.phone}</span>}
							<img
								src={!pfandMachine.pfandtastic.machine_img_url[0] ? bottleAutomat : pfandMachine.pfandtastic.machine_img_url[0]}
								style={{width: '200px', height: '200px', borderRadius: '50%'}}
							/>
						</div>
						<div style={{width: '75%', maxWidth: '400px'}}>
							<h3>Comments:</h3>
							{comments.length === 0 && <p style={{textAlign: 'center'}}>No comments</p>}
							{comments.length > 0 &&
								comments.map((comment) => {
									return <CommentCard key={comment._id} comment={comment} comments={comments} setComments={setComments} pfandmachine={pfandMachine} />;
								})}
						</div>
						{user ? (
							<div style={{flexDirection: 'row'}}>
								<form style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}} onSubmit={handleSubmitComment}>
									<label htmlFor="commentArea">Leave a comment: </label>
									<input type="textarea" value={commentText} id="commentArea" onChange={(e) => setCommentText(e.target.value)} />
									<Button type="submit">Post comment</Button>
								</form>
							</div>
						) : (
							<div>
								<form>
									<label>Leave a comment: </label>
									<p>Only logged in users can leave comments...</p>
								</form>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
