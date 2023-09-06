import React, {useContext, useEffect, useState} from 'react';
// import Modal from '@mui/material/Modal'; // Material-UI modal
import Button from '@mui/material/Button'; // Material-UI button
import TextField from '@mui/material/TextField'; // Material-UI text field
import {AuthContext} from '../context/AuthContext.js';
import Loader from '../components/Loader.js';
import Password from '../components/Password.js';
// import {emailValidation, passwordValidation} from '../utils/JSFunctions';
// import {deleteImage, uploadImage} from '../utils/imageMangement';
// import PasswordInput from './PasswordInput';
// import {baseURL} from '../utils/getServerURL';
// import getToken from '../utils/getToken';

function Profile() {
	const [loading, setLoading] = useState(false);
	const {user, setUser} = useContext(AuthContext);
	const [editMode, setEditMode] = useState(false);
	// const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		selectedFile: {},
		newPassword: '',
		oldPassword: '',
		newPwInvalid: false,
		oldPwInvalid: false,
		desc: '',
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFormData({
				...formData,
				selectedFile: e.target.files[0],
			});
		}
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (user) {
			if (formData.username !== user.username) {
				// Handle username change
				// ...
			} else if (formData.email !== user.email) {
				// Handle email change
				// ...
			} else if (formData.selectedFile) {
				// Handle file upload
				// ...
			} else if (formData.newPassword && formData.oldPassword) {
				// Handle password change
				// ...
			}
		}
		// Handle form submission based on form data
	};

	useEffect(() => {
		// Handle edit mode toggle
		// ...
	}, [editMode]);

	return (
		<div className='centeredDiv' style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', width: '100vw'}}>
			{user && (
				<div
					className='centeredDiv'
					style={{
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-evenly',
						width: '70vw',
						height: '70vh',
						backgroundColor: 'green',
						borderRadius: '25px',
					}}>
					{loading && <Loader />}

					<div>
						<h3>Account Details</h3>
						<Button
							style={!editMode ? {display: 'none', padding: '0 0.3em', paddingBottom: '0.2em'} : {}}
							variant='contained'
							color='warning'
							title='Edit Account Details'
							onClick={() => setEditMode(!editMode)}>
							X
						</Button>
					</div>

					{
						<div style={editMode ? {display: 'none'} : {}}>
							<div className='centeredDiv' style={{alignItems: 'center', justifyContent: 'space-evenly', gap: 100}}>
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
					}

					<Button variant='contained' color='warning' onClick={() => setEditMode(!editMode)} style={editMode ? {display: 'none'} : {}}>
						Edit Profile
					</Button>

					<form onSubmit={handleFormSubmit} style={editMode ? {display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30} : {display: 'none'}}>
						<TextField label='Username' fullWidth name='username' value={formData.username} onChange={handleInputChange} margin='normal' variant='outlined' />

						<TextField label='Email' name='email' fullWidth value={formData.email} onChange={handleInputChange} margin='normal' variant='outlined' />

						<Password invalidPassword={!formData.newPwInvalid} handleChanges={handleInputChange} />
						<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
							<label htmlFor='profile_picture'>Profile Picture:</label>
							<input type='file' name='profile_picture' placeholder='New Profile Image' onChange={handleFileAttach} />
						</div>

						<Button variant='contained' color='warning' type='submit'>
							Save Changes
						</Button>
					</form>

					<br />
					<br />
				</div>
			)}
		</div>
	);
}

export default Profile;
