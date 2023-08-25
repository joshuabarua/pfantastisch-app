import {FormEvent, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {NotOk} from '../@types';
import {toast} from 'react-toastify';

interface LoginResult {
	verified: boolean;
	token: string;
}

const formStyles: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
};

const Login = () => {
	const baseURL = import.meta.env.VITE_SERVER_BASE as string;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const redirect = useNavigate();

	const loginUser = async () => {
		// formData didnt work but headers did
		// const formData = new FormData();
		// formData.append('email', email);
		// formData.append('password', password);
		const urlencoded = new URLSearchParams();

		const myHeaders = new Headers();
		urlencoded.append('email', email);
		urlencoded.append('password', password);
		myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded,
		};
		try {
			const response = await fetch(`${baseURL}api/users/login`, requestOptions);
			if (response.ok) {
				const result = await response.json();
				const {token} = result as LoginResult;
				localStorage.setItem('token', token);
				toast.success('Login Successful');
				setTimeout(() => redirect('/'), 2000);
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
		loginUser().catch((e) => console.log(e));
	};

	return (
		<>
			<div
				className='centeredDiv'
				style={{flexDirection: 'column', width: '100vw'}}>
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
					<h1>Login</h1>
					<form
						onSubmit={handleSubmit}
						className='centeredDiv'
						style={{
							flexDirection: 'column',
							gap: 25,
						}}>
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
						<button type='submit'>Login</button>
					</form>

					<p>
						Not a user? <NavLink to='/newUser'>Sign Up</NavLink>
					</p>
				</div>
			</div>
		</>
	);
};

export default Login;
