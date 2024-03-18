import React from 'react';
import Button from '@mui/material/Button';
import {User} from '../@types';

interface Props {
	user: User;
	editMode: boolean;
	setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProfileDetails({user, editMode, setEditMode}: Props) {
	return (
		<div>
			<h3>Account Details</h3>
			<Button
				style={!editMode ? {display: 'none', padding: '0 0.3em', paddingBottom: '0.2em'} : {}}
				variant="contained"
				color="warning"
				title="Edit Account Details"
				onClick={() => setEditMode(!editMode)}>
				X
			</Button>

			<div style={editMode ? {display: 'none'} : {}}>
				<div className="centeredDiv" style={{alignItems: 'center', justifyContent: 'space-evenly', gap: 100}}>
					<img
						style={{
							border: 'solid 1px rgba(0,0,0,0.3)',
							borderRadius: '50%',
							height: 300,
							maxWidth: '100%',
						}}
						src={user.image_url}
						alt={`${user.username}'s profile`}
					/>

					<div>
						<h5>Username: {user.username}</h5>

						{user.email && <h5>Email: {user.email} </h5>}

						{user.createdAt && <h5>Profile Created: {new Date(user.createdAt).toDateString().substring(4)} </h5>}
					</div>
				</div>
			</div>

			<Button variant="contained" color="warning" onClick={() => setEditMode(!editMode)} style={editMode ? {display: 'none'} : {}}>
				Edit Profile
			</Button>
		</div>
	);
}

export default ProfileDetails;
