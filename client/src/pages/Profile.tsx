import React, {useState} from 'react';
import {useAuthStore} from '../context/AuthState.js';
import Loader from '../components/Loader.js';
import ProfileDetails from '../components/ProfileDetails.js';
import ProfileForm from '../components/ProfileForm.js';

interface UpdateFields {
	email?: string;
	password?: string;
	username?: string;
	profilePicFile?: File | null;
}

function Profile() {
	const {user, update} = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [updatedFields, setUpdatedFields] = useState<UpdateFields>({});

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedFields({...updatedFields, email: e.target.value});
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedFields({...updatedFields, password: e.target.value});
	};

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedFields({...updatedFields, username: e.target.value});
	};

	const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		setUpdatedFields({...updatedFields, profilePicFile: file});
	};

	const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			await update({
				email: updatedFields.email || user?.email || '',
				password: updatedFields.password || '',
				username: updatedFields.username || user?.username || '',
				profilePicFile: updatedFields.profilePicFile || null,
			});
			setEditMode(false);
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return <div>Please log in to view your profile.</div>;
	}

	return (
		<div className="centeredDiv" style={{flexDirection: 'column', width: '100vw'}}>
			<div
				className="centeredDiv"
				style={{
					flexDirection: 'column',
					width: '70vw',
					height: '70vh',
					backgroundColor: 'whitesmoke',
					borderRadius: '25px',
					padding: '20px',
				}}>
				{loading && <Loader />}

				<ProfileDetails user={user} editMode={editMode} setEditMode={setEditMode} />

				<ProfileForm
					updatedFields={updatedFields}
					editMode={editMode}
					handleEmailChange={handleEmailChange}
					handlePasswordChange={handlePasswordChange}
					handleUsernameChange={handleUsernameChange}
					handleProfilePicChange={handleProfilePicChange}
					handleUpdate={handleUpdate}
					validationBool={false}
				/>

				{/* <Button variant="contained" color="warning" onClick={() => setEditMode(!editMode)} style={editMode ? {display: 'none'} : {}}>
					Edit Profile
				</Button> */}
			</div>
		</div>
	);
}

export default Profile;
