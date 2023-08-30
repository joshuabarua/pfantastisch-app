import {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

function Nav() {
	const {user, logout} = useContext(AuthContext);
	const navContainerStyles: React.CSSProperties = {
		height: '100vh',
		width: '150px',
		border: 'solid 1px black',
		position: 'sticky',
		display: 'flex',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		flexDirection: 'column',
		padding: '0 1em',
	};

	const linksContainerStyles: React.CSSProperties = {
		justifyContent: 'space-evenly',
		alignItems: 'center',
		flexDirection: 'column',
		display: 'flex',
		gap: '1em',
	};

	const activeLink: React.CSSProperties = {
		color: 'red',
		fontWeight: 'bold',
	};

	return (
		<nav style={navContainerStyles}>
			<p>{user ? <img src={`${user.image_url}`} className='navProfilePic' /> : <></>}</p>
			<div style={linksContainerStyles}>
				<NavLink to='/' style={({isActive}) => (isActive ? activeLink : {})}>
					Homepage
				</NavLink>
				<NavLink to='/users' style={({isActive}) => (isActive ? activeLink : {})}>
					Users
				</NavLink>
				<NavLink to='/map' style={({isActive}) => (isActive ? activeLink : {})}>
					Pfand Finder
				</NavLink>
				<NavLink to='/login' style={({isActive}) => (isActive ? activeLink : {})}>
					Login
				</NavLink>
			</div>
			<p>
				{user ? (
					<button
						onClick={() => {
							logout();
						}}>
						Logout
					</button>
				) : (
					'Please Login...'
				)}
			</p>
		</nav>
	);
}

export default Nav;
