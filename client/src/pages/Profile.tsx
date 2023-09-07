import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
// import Modal from '@mui/material/Modal'; // Material-UI modal
import Button from '@mui/material/Button'; // Material-UI button
import TextField from '@mui/material/TextField'; // Material-UI text field
import {AuthContext} from '../context/AuthContext.js';
import Loader from '../components/Loader.js';

import InputAdornment from '@mui/material/InputAdornment/InputAdornment.js';
// import {emailValidation, passwordValidation} from '../utils/JSFunctions';
// import {deleteImage, uploadImage} from '../utils/imageMangement';
// import PasswordInput from './PasswordInput';
// import {baseURL} from '../utils/getServerURL';
// import getToken from '../utils/getToken';

interface updateFields {
	email?: string;
	password?: string;
	username?: string;
	profilePicFile: File | null;
}

function Profile() {
	// update << Add to auth context part
	const {user} = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	// const [showModal, setShowModal] = useState(false);

	const [updatedFields, setUpdatedFields] = useState<{
		email?: string;
		password?: string;
		username?: string;
		profilePicFile?: File | null;
	}>({});
	const passwordToggle = () => {
		setPasswordVisibility(!passwordVisibility);
	};

	// function passwordValidation(password: string) {
	// 	const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
	// 	return passwordRegex.test(password);
	// }

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUpdatedFields({...updatedFields, email: e.target.value});
	};

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUpdatedFields({...updatedFields, password: e.target.value});
	};

	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUpdatedFields({...updatedFields, username: e.target.value});
	};

	const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		setUpdatedFields({...updatedFields, profilePicFile: file});
	};

	const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// update(updatedFields as updateFields);
		// setUser(updatedFields);
	};

	useEffect(() => {
		// editModeToggle();
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
						backgroundColor: 'whitesmoke',
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

					<form onSubmit={handleUpdate} style={editMode ? {display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30} : {display: 'none'}}>
						<TextField label='Username' fullWidth name='username' value={updatedFields.username} onChange={handleUsernameChange} margin='normal' variant='outlined' />

						<TextField label='Email' name='email' fullWidth value={updatedFields.email} onChange={handleEmailChange} margin='normal' variant='outlined' />

						<TextField
							type={passwordVisibility ? 'text' : 'password'}
							name='password'
							placeholder={'Enter new password'}
							variant='outlined'
							onChange={handlePasswordChange}
							// error={!newPwInvalid}
							autoComplete='off'
							required
							fullWidth
							value={updatedFields.password}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<Button variant='outlined' onClick={passwordToggle} color='primary' size='small'>
											{passwordVisibility ? 'Hide' : 'Show'}
										</Button>
									</InputAdornment>
								),
							}}
							// helperText={!newPwInvalid ? 'Password must be a minimum of 6 characters and include at least one number, a lowercase and uppercase letter.' : ''}
						/>
						<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
							<label htmlFor='profile_picture'>Profile Picture:</label>
							<input type='file' name='profile_picture' placeholder='New Profile Image' onChange={handleProfilePicChange} />
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
