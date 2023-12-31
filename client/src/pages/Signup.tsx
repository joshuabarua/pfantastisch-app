import {FormEvent, useContext, useState} from 'react';
import {NavLink} from 'react-router-dom';
// import {Users} from '../@types';
import {AuthContext} from '../context/AuthContext';

const formStyles: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
};
const Signup = () => {
	const {signup} = useContext(AuthContext);
	// const [users, setUsers] = useState<Users>([]);

	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		signup(email, username, password, profilePicFile).catch((e: Error) =>
			console.log(e)
		);
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
