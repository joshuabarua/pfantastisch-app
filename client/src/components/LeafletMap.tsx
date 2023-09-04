import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import {Supermarket, LatLongLocation} from '../@types';
import {Icon} from 'leaflet';
import Button from '@mui/material/Button/Button';
import {slide as Menu} from 'react-burger-menu';
import {useState} from 'react';

const maps = {base: 'https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?'};
const customIcon = new Icon({
	iconUrl: '/src/assets/icons/plastic-bottle.png',
	iconSize: [40, 40],
});

interface Props {
	userLocation: LatLongLocation;
	supermarkets?: Supermarket[];
}

//TODO: Try to send user to google maps if they select get directions. Need to make a sidebar - Create sidebar for app
const LeafletMap = (props: Props) => {
	const {userLocation, supermarkets} = props;
	const [isOpen, setIsOpen] = useState(false);

	const handleOnOpen = () => {
		if (!isOpen) {
			setIsOpen(true);
			console.log(isOpen);
		} else return;
	};
	return (
		<div className='leaflet-container'>
			<div className='container-autocomplete'></div>
			<MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={16} style={{width: '70vw', height: '70vh', minWidth: '300px'}}>
				<TileLayer
					url={`${maps.base}access-token=${import.meta.env.VITE_JAWG_MAP_ACCESS_TOKEN}`}
					attribution={
						'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					}
					minZoom={14}
					maxZoom={18}
				/>

				{userLocation && (
					<Marker position={[userLocation.latitude, userLocation.longitude]}>
						<Popup>Your Location</Popup>
					</Marker>
				)}

				{supermarkets ? (
					supermarkets.map((supermarket, index) => (
						<Marker key={index} position={[supermarket.coordinates.latitude, supermarket.coordinates.longitude]} icon={customIcon}>
							<Popup>
								<div className='centeredDiv' style={{flexDirection: 'column', gap: 5, wordWrap: 'break-word'}}>
									<h3>{supermarket.name}</h3>
									<img src={supermarket.image_url} style={{width: '120px', height: '120px', borderRadius: '25px'}} />
									<span>
										Address: {supermarket.location.address1}, {supermarket.location.city}, {supermarket.location.zip_code}, {'  '}
										{supermarket.location.country}
									</span>
									<span>Rating: {supermarket.rating}</span>
									<span>Reviews: {supermarket.review_count}</span>
									<span>Phone: {supermarket.phone}</span>
									<span style={supermarket.pfandtastic.isOperational ? {color: '#a5d6a7'} : {color: '#e57373'}}>
										{supermarket.pfandtastic.isOperational ? 'Pfand Machine Operational' : 'Pfand Machine Not Operational'}
									</span>
									<Button variant='contained' color={'primary'} onClick={handleOnOpen}>
										Pfand-Automat Details
									</Button>
								</div>
							</Popup>
						</Marker>
					))
				) : (
					<></>
				)}
			</MapContainer>
			<Menu right onOpen={handleOnOpen}>
				<a id='home' className='menu-item' href='/'>
					Home
				</a>
				<a id='about' className='menu-item' href='/about'>
					About
				</a>
				<a id='contact' className='menu-item' href='/contact'>
					Contact
				</a>
				<a onClick={(e) => e.preventDefault()} className='menu-item--small' href=''>
					Settings
				</a>
			</Menu>
		</div>
	);
};

export default LeafletMap;
