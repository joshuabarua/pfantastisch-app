import {useState} from 'react';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';

interface Props {
	handleChanges: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	invalidPassword: boolean;
}

function PasswordInput({handleChanges, invalidPassword}: Props) {
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const passwordToggle = () => {
		setPasswordVisibility(!passwordVisibility);
	};

	return (
		<>
			<TextField
				type={passwordVisibility ? 'text' : 'password'}
				name='password'
				placeholder={'Enter new password'}
				variant='outlined'
				onChange={handleChanges}
				error={invalidPassword}
				autoComplete='off'
				required
				fullWidth
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<Button variant='outlined' onClick={passwordToggle} color='primary' size='small'>
								{passwordVisibility ? 'Hide' : 'Show'}
							</Button>
						</InputAdornment>
					),
				}}
				helperText={invalidPassword ? 'Password must be a minimum of 6 characters and include at least one number, a lowercase and uppercase letter.' : ''}
			/>
		</>
	);
}

export default PasswordInput;
