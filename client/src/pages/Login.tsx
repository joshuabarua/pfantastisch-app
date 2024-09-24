import {FormEvent, useContext, useState} from 'react';
import {NavLink} from 'react-router-dom';
import bottlesImage from '../assets/imgs/stylishbottles.jpeg';

import {AuthContext} from '../context/AuthContext';

const formStyles: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
};

const Login = () => {
	const {login} = useContext(AuthContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login(email, password).catch((e) => console.log(e));
	};

	return (
		<>
			<div
				className="centeredDiv"
				style={{
					width: '100vw',
					height: '100vh',
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
							<input value={email} name="email" onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div style={formStyles}>
							<label htmlFor="password">Password</label>
							<input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						</div>
						<button type="submit">Login</button>
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
