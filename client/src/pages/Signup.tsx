import {FormEvent, useState} from 'react';

import bottlesImage from '../assets/imgs/artisticbottles.jpeg';
import {NavLink} from 'react-router-dom';
import {useAuthStore} from '../context/AuthState';
import {PASSWORD_REGEX, PASSWORD_RULE} from '../utils/validation';

const formStyles: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
};
const Signup = () => {
	const signup = useAuthStore((s) => s.signup);
	const [submitting, setSubmitting] = useState(false);

	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

	const passwordValid = PASSWORD_REGEX.test(password);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!passwordValid) return;
		setSubmitting(true);
		await signup({email: email.trim(), password, username: username.trim(), profilePicFile});
		setSubmitting(false);
	};

	return (
		<>
			<div
				className="centeredDiv"
				style={{
					width: '100%',
					height: 'calc(100vh - 70px)',
					minHeight: 560,
					position: 'relative',
					overflow: 'hidden',
				}}>
				<div
					className="centeredDiv"
					style={{
						flexDirection: 'column',
						width: '100%',
						height: '120%',
						zIndex: -1,
						backgroundImage: `url(${bottlesImage})`,
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						backgroundBlendMode: 'overlay',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						position: 'absolute',
						top: -0,
						left: 0,
					}}></div>

				<div
					className="centeredDiv"
					style={{
						flexDirection: 'column',
						backgroundColor: 'white',
						minWidth: '320px',
						width: '40vw',
						maxWidth: '550px',
						maxHeight: '700px',
						height: '50vh',
						minHeight: '500px',
						borderRadius: '25px',
						boxShadow: '0 0 20px #dbd6d6',
					}}>
					<h1>Signup</h1>
					<form
						onSubmit={handleSubmit}
						className="centeredDiv"
						style={{
							flexDirection: 'column',
							gap: 25,
							zIndex: 1,
						}}>
						<div style={formStyles}>
							<label htmlFor="username">Username</label>
							<input id="username" required autoComplete="username" value={username} name="username" onChange={(e) => setUsername(e.target.value)} />
						</div>
						<div style={formStyles}>
							<label htmlFor="email">Email</label>
							<input id="email" type="email" required autoComplete="email" value={email} name="email" onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div style={formStyles}>
							<label htmlFor="password">Password</label>
							<input
								id="password"
								type="password"
								required
								autoComplete="new-password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								aria-describedby="password-rule"
							/>
							<small id="password-rule" style={{maxWidth: 260, textAlign: 'center', color: password && !passwordValid ? '#c62828' : '#555'}}>
								{PASSWORD_RULE}
							</small>
						</div>
						<div style={formStyles}>
							<label htmlFor="profilePic">Profile Picture </label>
							<input
								id="profilePic"
								type="file"
								accept="image/png, image/jpeg"
								name="profilePic"
								placeholder="Choose a file..."
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
						<button type="submit" disabled={submitting || !passwordValid}>
							{submitting ? 'Signing up...' : 'Signup'}
						</button>
					</form>

					<p>
						Already a user? <NavLink to="/login">Login</NavLink>
					</p>
				</div>
			</div>
		</>
	);
};

export default Signup;
