import {ChangeEvent, FormEvent, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import {UpdateFields} from '../context/AuthState';
import {PASSWORD_RULE} from '../utils/validation';

interface Props {
	fields: UpdateFields;
	passwordValid: boolean;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	onCancel: () => void;
}

function ProfileForm({fields, passwordValid, onChange, onSubmit, onCancel}: Props) {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const changingPassword = Boolean(fields.password);

	return (
		<form onSubmit={onSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
			<TextField label="Username" name="username" fullWidth value={fields.username ?? ''} onChange={onChange} variant="outlined" required />

			<TextField label="Email" name="email" type="email" fullWidth value={fields.email ?? ''} onChange={onChange} variant="outlined" required />

			<TextField
				label="New password (optional)"
				type={passwordVisible ? 'text' : 'password'}
				name="password"
				variant="outlined"
				autoComplete="new-password"
				fullWidth
				value={fields.password ?? ''}
				onChange={onChange}
				error={!passwordValid}
				helperText={changingPassword ? PASSWORD_RULE : 'Leave empty to keep your current password'}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<Button variant="outlined" onClick={() => setPasswordVisible((v) => !v)} size="small">
								{passwordVisible ? 'Hide' : 'Show'}
							</Button>
						</InputAdornment>
					),
				}}
			/>

			{changingPassword && (
				<TextField
					label="Current password"
					type="password"
					name="currentPassword"
					variant="outlined"
					autoComplete="current-password"
					fullWidth
					required
					value={fields.currentPassword ?? ''}
					onChange={onChange}
				/>
			)}

			<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
				<label htmlFor="profilePicFile">Profile Picture:</label>
				<input id="profilePicFile" type="file" name="profilePicFile" accept="image/png, image/jpeg" onChange={onChange} />
			</div>

			<div style={{display: 'flex', gap: '10px'}}>
				<Button variant="contained" color="warning" onClick={onCancel}>
					Cancel
				</Button>
				<Button variant="contained" color="primary" type="submit" disabled={!passwordValid}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}

export default ProfileForm;
