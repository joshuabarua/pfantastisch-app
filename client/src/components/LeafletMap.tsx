import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import {Supermarket, LatLongLocation} from '../@types';
import {Icon} from 'leaflet';
import Button from '@mui/material/Button/Button';
import {NavLink} from 'react-router-dom';
import userPin from '../assets/icons/user-pin.png';
import bottle from '../assets/icons/plastic-bottle.png';
import {useRef, useState} from 'react';

const maps = {base: 'https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?'};

const customIcon = (icon: string) => {
	return new Icon({
		iconUrl: icon,
		iconSize: [60, 60],
	});
};

interface Props {
	userLocation: LatLongLocation;
	supermarkets?: Supermarket[];
}

//TODO: Try to send user to google maps if they select get directions. Need to make a sidebar - Create sidebar for app
const LeafletMap = (props: Props) => {
	const {userLocation, supermarkets} = props;
	const markerRefs = useRef<(L.Marker | null)[]>([]);

	const handleMarkerClick = (index: number) => {
		const marker = markerRefs.current[index];
		if (marker) {
			marker.openPopup();
		}
	};
	return (
		<div className="centeredDiv" style={{padding: 50, alignItems: 'flex-start', justifyContent: 'center', height: '100%', gap: 10}}>
			<div className="" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%', flex: 1, gap: 5}}>
				<h1>Supermarkets</h1>
				<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', maxHeight: '100%', overflow: 'scroll', width: '100%'}}>
					{supermarkets &&
						supermarkets.map((supermarket, index) => (
							<Button
								key={supermarket._id}
								variant="outlined"
								onClick={() => handleMarkerClick(index)}
								style={{marginTop: 10, width: '200px', height: '100px', lineHeight: '1.2'}}>
								<div className="centeredDiv" style={{flexDirection: 'column'}}>
									<strong>{supermarket.name}</strong> {supermarket.display_address}
								</div>
							</Button>
						))}
				</div>
			</div>
			<div className="centeredDiv" style={{flexDirection: 'column'}}>
				<h1> Map</h1>
				<MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={16} style={{width: '60vw', height: '70vh', minWidth: '300px'}}>
					<TileLayer
						url={`${maps.base}access-token=${import.meta.env.VITE_JAWG_MAP_ACCESS_TOKEN}`}
						attribution={
							'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						}
						minZoom={14}
						maxZoom={18}
					/>

					{userLocation && (
						<Marker position={[userLocation.latitude, userLocation.longitude]} icon={customIcon(userPin)}>
							<Popup>Your Location</Popup>
						</Marker>
					)}

					{supermarkets ? (
						supermarkets.map((supermarket, index) => (
							<Marker
								key={index}
								position={[supermarket.coordinates.latitude, supermarket.coordinates.longitude]}
								icon={customIcon(bottle)}
								ref={(el) => (markerRefs.current[index] = el)}>
								<Popup>
									<div className="centeredDiv" style={{flexDirection: 'column', gap: 5, wordWrap: 'break-word'}}>
										<h3>{supermarket.name}</h3>
										<img src={supermarket.image_url} style={{width: '120px', height: '120px', borderRadius: '25px'}} />
										<span>
											Address: {supermarket.location.address1}, {supermarket.location.city}, {supermarket.location.zip_code}, {'  '}
											{supermarket.location.country}
										</span>
										<span>Rating: {supermarket.rating}</span>
										<span>Phone: {supermarket.phone}</span>
										<span style={supermarket.pfandtastic.isOperational ? {color: '#a5d6a7'} : {color: '#e57373'}}>
											{supermarket.pfandtastic.isOperational ? 'Pfand Machine Operational' : 'Pfand Machine Not Operational'}
										</span>
										<Button variant="contained" style={{backgroundColor: '#fff', color: '#74f9b9'}}>
											<NavLink to={`/map/pfandautomat/${supermarket._id}`}>PFAND PAGE </NavLink>
										</Button>
									</div>
								</Popup>
							</Marker>
						))
					) : (
						<></>
					)}
				</MapContainer>
			</div>
		</div>
	);
};

export default LeafletMap;
