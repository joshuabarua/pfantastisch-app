import {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import HomeIcon from '@mui/icons-material/Home'; // Import Material-UI's Home icon
import MapIcon from '@mui/icons-material/Map'; // Import Material-UI's Map icon
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from '@mui/material/IconButton/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import bottleLogo from '../assets/imgs/bottle200.png';

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
			<img src={bottleLogo} />
			<p>{user ? <img src={`${user.image_url}`} className="navProfilePic" style={{border: 'solid 1px rgba(0,0,0,0.2)'}} /> : <></>}</p>
			<div style={linksContainerStyles}>
				<NavLink to="/" style={({isActive}) => (isActive ? activeLink : {})}>
					<IconButton color="inherit">
						<HomeIcon />
					</IconButton>
				</NavLink>

				<NavLink to="/map" style={({isActive}) => (isActive ? activeLink : {})}>
					<IconButton color="inherit">
						<MapIcon />
					</IconButton>
				</NavLink>
				{user ? (
					<NavLink to="/myprofile" style={({isActive}) => (isActive ? activeLink : {})}>
						<IconButton color="inherit">
							<SettingsIcon />
						</IconButton>
					</NavLink>
				) : (
					<></>
				)}

				{user ? (
					<></>
				) : (
					<NavLink to="/login" style={({isActive}) => (isActive ? activeLink : {})}>
						<IconButton color="inherit">
							<ExitToAppIcon />
						</IconButton>
					</NavLink>
				)}
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
