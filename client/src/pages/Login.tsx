import {FormEvent, useState} from 'react';
import {NavLink} from 'react-router-dom';
import bottlesImage from '../assets/imgs/stylishbottles.jpeg';
import {useAuthStore} from '../context/AuthState';

const formStyles: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
};

const Login = () => {
	const login = useAuthStore((s) => s.login);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmitting(true);
		await login(email.trim(), password);
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
						backgroundImage: `url(${bottlesImage})`,
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						backgroundBlendMode: 'overlay',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						position: 'absolute',
						top: 0,
						left: 0,
					}}></div>

				<div
					className="centeredDiv"
					style={{
						zIndex: 2,
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
						position: 'relative',
					}}>
					<h1>Login</h1>
					<form
						onSubmit={handleSubmit}
						className="centeredDiv"
						style={{
							flexDirection: 'column',
							gap: 25,
							zIndex: 3,
						}}>
						<div style={formStyles}>
							<label htmlFor="email">Email</label>
							<input id="email" type="email" autoComplete="email" required value={email} name="email" onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div style={formStyles}>
							<label htmlFor="password">Password</label>
							<input id="password" type="password" autoComplete="current-password" required name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						</div>
						<button type="submit" disabled={submitting}>
							{submitting ? 'Logging in...' : 'Login'}
						</button>
					</form>

					<p>
						Not a user? <NavLink to="/newUser">Sign Up</NavLink>
					</p>
				</div>
			</div>
		</>
	);
};

export default Login;
