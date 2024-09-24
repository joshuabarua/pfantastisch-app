import {useContext, useRef} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import HomeIcon from '@mui/icons-material/Home'; // Import Material-UI's Home icon
import MapIcon from '@mui/icons-material/Map'; // Import Material-UI's Map icon
import ExitToAppIcon from '@mui/icons-material/Login';
import LoginToApp from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import useRotatingText from '../hooks/useRotatingText';
import {useAuthStore} from '../context/AuthState';

const navContainerStyles: React.CSSProperties = {
	position: 'sticky',
	width: '100vw',
	height: '60px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '0 1em',
	backgroundColor: 'transparent',
};
const linksContainerStyles: React.CSSProperties = {
	justifyContent: 'space-evenly',
	alignItems: 'center',
	display: 'flex',
	gap: '.5em',
	marginRight: '30px',
	overflow: 'hidden',
};
const activeLink: React.CSSProperties = {
	color: '#ffffff',
	fontWeight: 'bold',
};

const normalLink: React.CSSProperties = {
	color: '#929dff',
	fontWeight: 'bold',
};
function Nav() {
	const {user, logout} = useAuthStore();

	const textRef = useRotatingText('Pfantastisch!');

	return (
		<nav style={navContainerStyles}>
			<div className="circle">
				<div className="spin-text" style={{color: 'white', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'}} ref={textRef}></div>
			</div>

			<p>{user ? <img src={`${user.image_url}`} className="navProfilePic" style={{border: 'solid 1px rgba(0,0,0,0.2)'}} /> : <></>}</p>
			<div style={linksContainerStyles}>
				<NavLink to="/" style={({isActive}) => (isActive ? activeLink : normalLink)}>
					<IconButton color="inherit">
						<HomeIcon />
					</IconButton>
				</NavLink>
				<NavLink to="/map" style={({isActive}) => (isActive ? activeLink : normalLink)}>
					<IconButton color="inherit">
						<MapIcon />
					</IconButton>
				</NavLink>
				{user ? (
					<NavLink to="/myprofile" style={({isActive}) => (isActive ? activeLink : normalLink)}>
						<IconButton color="inherit">
							<SettingsIcon />
						</IconButton>
					</NavLink>
				) : (
					<></>
				)}

				{user ? (
					<IconButton color="inherit">
						<ExitToAppIcon onClick={() => logout()} />
					</IconButton>
				) : (
					<NavLink to="/login" style={({isActive}) => (isActive ? activeLink : normalLink)}>
						<IconButton color="inherit">
							<LoginToApp />
						</IconButton>
					</NavLink>
				)}
			</div>
		</nav>
	);
}

export default Nav;
