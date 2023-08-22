import {FormEvent, useState} from 'react';

interface LoginResult {
	verified: boolean;
	token: string;
}

const Login = () => {
	const baseURL = import.meta.env.VITE_SERVER_BASE as string;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
		const urlencoded = new URLSearchParams();
		urlencoded.append('email', email);
		urlencoded.append('password', password);
		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded,
		};
		fetch(`${baseURL}api/users/login`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				const {token} = result as LoginResult;
				localStorage.setItem('token', token);
				console.log('user verified and token saved');
			})
			.catch((error) => console.log('error', error));
	};
	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<input value={email} onChange={(e) => setEmail(e.target.value)} />
				<input
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type='submit'>Login</button>
			</form>
		</div>
	);
};

export default Login;
