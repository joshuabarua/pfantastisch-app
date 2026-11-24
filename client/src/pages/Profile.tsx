import React, {useState} from 'react';
import Button from '@mui/material/Button';
import {UpdateFields, useAuthStore} from '../context/AuthState';
import Loader from '../components/Loader';
import ProfileDetails from '../components/ProfileDetails';
import ProfileForm from '../components/ProfileForm';
import {PASSWORD_REGEX} from '../utils/validation';

function Profile() {
	const user = useAuthStore((s) => s.user);
	const update = useAuthStore((s) => s.update);
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [fields, setFields] = useState<UpdateFields>({});

	if (!user) return null; // ProtectedRoute guarantees a user

	const startEditing = () => {
		setFields({username: user.username, email: user.email, password: '', currentPassword: '', profilePicFile: null});
		setEditMode(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value, files} = e.target;
		setFields((prev) => ({...prev, [name]: name === 'profilePicFile' ? files?.[0] ?? null : value}));
	};

	const passwordValid = !fields.password || PASSWORD_REGEX.test(fields.password);

	const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!passwordValid) return;
		setLoading(true);
		const ok = await update({
			username: fields.username !== user.username ? fields.username : undefined,
			email: fields.email !== user.email ? fields.email : undefined,
			password: fields.password || undefined,
			currentPassword: fields.currentPassword,
			profilePicFile: fields.profilePicFile,
		});
		setLoading(false);
		if (ok) setEditMode(false);
	};

	return (
		<div className="centeredDiv" style={{flexDirection: 'column', width: '100%', minHeight: 'calc(100vh - 70px)', paddingBottom: 40}}>
			<h1 style={{color: 'whitesmoke'}}>Profile</h1>

			<div
				className="centeredDiv"
				style={{
					flexDirection: 'column',
					justifyContent: 'flex-start',
					width: '70%',
					minWidth: '300px',
					maxWidth: '800px',
					minHeight: '300px',
					backgroundColor: '#f5f5f5',
					borderRadius: '15px',
					padding: '30px',
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
					margin: '0px 20px',
					gap: '20px',
				}}>
				{loading && <Loader />}

				{editMode ? (
					<div style={{width: '100%', maxWidth: '500px'}}>
						<ProfileForm fields={fields} passwordValid={passwordValid} onChange={handleChange} onSubmit={handleUpdate} onCancel={() => setEditMode(false)} />
					</div>
				) : (
					<>
						<ProfileDetails user={user} />
						<Button variant="contained" color="primary" onClick={startEditing}>
							Edit Profile
						</Button>
					</>
				)}
			</div>
		</div>
	);
}

export default Profile;
