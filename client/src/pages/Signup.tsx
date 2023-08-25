import {FormEvent, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {NotOk, Users} from '../@types';
import {toast} from 'react-toastify';

interface SignupResult {
	token: string;
}

const formStyles: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
};
const Signup = () => {
	const baseURL = import.meta.env.VITE_SERVER_BASE;
	const [users, setUsers] = useState<Users>([]);
	const redirect = useNavigate();

	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

	const createUser = async () => {
		const formData = new FormData();
		formData.append('username', username);
		formData.append('email', email);
		formData.append('password', password);
		if (profilePicFile) {
			formData.append('image_url', profilePicFile);
		}
		const requestOptions = {
			method: 'POST',
			body: formData,
		};
		try {
			const response = await fetch(`${baseURL}api/users/new`, requestOptions);
			if (response.ok) {
				const result = await response.json();
				const {token} = result as SignupResult;
				localStorage.setItem('token', token);
				toast.success('Signup Successful, logging in...');
				setTimeout(() => redirect('/'), 2000);

				setUsers([...users, result]);
			} else {
				const result = (await response.json()) as NotOk;
				toast.error(`Something went wrong - ${result.error}`);
			}
		} catch (e) {
			console.log(e);
			const {message} = e as Error;
			toast.error(`Something went wrong - ${message}`);
		}
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createUser().catch((e) => console.log(e));
	};

	return (
		<div className='centeredDiv' style={{flexDirection: 'column', width: '100vw'}}>
			<div
				className='centeredDiv'
				style={{
					flexDirection: 'column',
					backgroundColor: 'white',
					width: '40vw',
					maxWidth: '550px',
					height: '70vh',
					minHeight: '500px',
					borderRadius: '25px',
					boxShadow: '0 0 20px #dbd6d6',
				}}>
				<h1>Signup</h1>
				<form
					onSubmit={handleSubmit}
					className='centeredDiv'
					style={{
						flexDirection: 'column',
						gap: 25,
					}}>
					<div style={formStyles}>
						<label htmlFor='username'>Username</label>
						<input
							value={username}
							name='username'
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div style={formStyles}>
						<label htmlFor='email'>Email</label>
						<input
							value={email}
							name='email'
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div style={formStyles}>
						<label htmlFor='password'>Password</label>
						<input
							type='password'
							name='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div style={formStyles}>
						<label htmlFor='profilePic'>Profile Picture </label>
						<input
							type='file'
							name='profilePic'
							placeholder='Choose a file...'
							onChange={(e) => {
								e.target.files && setProfilePicFile(e.target.files[0]);
							}}
							style={{
								backgroundColor: 'black',
								border: 'black 1px solid',
								color: 'white',
							}}
						/>
					</div>
					<button type='submit'>Signup</button>
				</form>

				<p>
					Not a user? <NavLink to='/Login'>Login</NavLink>
				</p>
			</div>
		</div>
	);
};

export default Signup;
