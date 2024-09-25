import {ChangeEvent, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import {updateFields} from '../@types';

interface Props {
	editMode: boolean;
	validationBool: boolean;
	updatedFields: updateFields | undefined;
	handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleUsernameChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleProfilePicChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
	onCancel: () => void;
}
function ProfileForm({
	editMode,
	validationBool,
	updatedFields,
	handleEmailChange,
	handlePasswordChange,
	handleUsernameChange,
	handleProfilePicChange,
	handleUpdate,
	onCancel,
}: Props) {
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const passwordToggle = () => {
		setPasswordVisibility(!passwordVisibility);
	};
	return (
		<form
			onSubmit={handleUpdate}
			style={
				editMode
					? {
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 30,
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  }
					: {display: 'none'}
			}>
			<TextField label="Username" fullWidth name="username" value={updatedFields?.username} onChange={handleUsernameChange} margin="normal" variant="outlined" />

			<TextField label="Email" name="email" fullWidth value={updatedFields?.email} onChange={handleEmailChange} margin="normal" variant="outlined" />

			<TextField
				type={passwordVisibility ? 'text' : 'password'}
				name="password"
				placeholder={'Enter new password'}
				variant="outlined"
				onChange={handlePasswordChange}
				error={!validationBool}
				autoComplete="off"
				required
				fullWidth
				value={updatedFields?.password}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<Button variant="outlined" onClick={passwordToggle} color="primary" size="small">
								{passwordVisibility ? 'Hide' : 'Show'}
							</Button>
						</InputAdornment>
					),
				}}
				helperText={!validationBool ? 'Password must be a minimum of 6 characters and include at least one number, a lowercase and uppercase letter.' : ''}
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: 5,
				}}>
				<label htmlFor="profile_picture">Profile Picture:</label>
				<input type="file" name="profile_picture" placeholder="New Profile Image" onChange={handleProfilePicChange} />
			</div>
			<div style={{display: 'flex', gap: '10px'}}>
				{editMode && (
					<Button variant="contained" color="warning" onClick={onCancel}>
						Cancel
					</Button>
				)}
				<Button variant="contained" color="primary" type="submit">
					Save Changes
				</Button>
			</div>
		</form>
	);
}

export default ProfileForm;
