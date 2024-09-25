import {NavLink} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import ExitToAppIcon from '@mui/icons-material/Login';
import LoginToApp from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import useRotatingText from '../hooks/useRotatingText';
import {useAuthStore} from '../context/AuthState';
import {useEffect} from 'react';
import SVGLogo from './SVGLogo';

const navContainerStyles: React.CSSProperties = {
	position: 'sticky',
	width: '100vw',
	height: '70px',
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
	color: '#fff',
	fontWeight: 'bold',
	borderBottom: '1px solid #fff',
};

const normalLink: React.CSSProperties = {
	color: '#bcc3fa',
	fontWeight: 'bold',
};
function Nav() {
	const {user, logout} = useAuthStore();
	const textRef = useRotatingText('Pfantastisch!');

	return (
		<nav style={navContainerStyles}>
			<div className="circle">
				<div className="logoPerson">{user ? <img src={`${user.image_url}`} className="navProfilePic" style={{}} /> : <SVGLogo fillColor={'#bcc3fa'} />}</div>
				<div className="spin-text" style={{color: 'white', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'}} ref={textRef}></div>
			</div>

			<p></p>
			<div style={linksContainerStyles}>
				<NavLink to="/" style={({isActive}) => (isActive ? activeLink : normalLink)}>
					<IconButton color="inherit" size={'large'}>
						<HomeIcon />
					</IconButton>
				</NavLink>
				<NavLink to="/map" style={({isActive}) => (isActive ? activeLink : normalLink)}>
					<IconButton color="inherit" size={'large'}>
						<MapIcon />
					</IconButton>
				</NavLink>
				{user ? (
					<NavLink to="/myprofile" style={({isActive}) => (isActive ? activeLink : normalLink)}>
						<IconButton color="inherit" size={'large'}>
							<SettingsIcon />
						</IconButton>
					</NavLink>
				) : (
					<></>
				)}

				{user !== null ? (
					<IconButton color="inherit" onClick={() => logout()} sx={normalLink}>
						<ExitToAppIcon />
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
