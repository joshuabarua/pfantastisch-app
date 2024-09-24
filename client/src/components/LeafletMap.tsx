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
		<div
			style={{
				padding: '30px 30px',
				display: 'grid',
				alignItems: 'flex-start',
				justifyContent: 'center',
				gridTemplateColumns: 'minmax(200px, 400px), minmax(400px, 100%))',
				height: '70vh',
				gap: 20,
				overflowY: 'auto',
			}}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-start',
					alignItems: 'center',
					minWidth: '250px',
					height: '90vh',
					borderRight: '1px solid grey',
					flex: 1,
					gap: 10,
				}}>
				<h1>Pfandautomats</h1>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
						gridGap: '1px 1px',
						overflow: 'auto',
						width: '100%',
						justifyItems: 'center',
						height: '100%',
						padding: 10,
					}}>
					{supermarkets &&
						supermarkets.map((supermarket, index) => (
							<Button key={supermarket._id} variant="outlined" onClick={() => handleMarkerClick(index)} style={{width: '170px', height: '100px', lineHeight: '1.2'}}>
								<div className="centeredDiv" style={{flexDirection: 'column'}}>
									<strong>{supermarket.name}</strong> {supermarket.display_address}
								</div>
							</Button>
						))}
				</div>
			</div>
			<div className="centeredDiv" style={{flexDirection: 'column', width: '100%'}}>
				<h1> Map</h1>
				<MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={16} style={{width: '100% !important', height: '80vh', minWidth: '280px'}}>
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
										<span>Phone: {supermarket.phone}</span>
										<span>Rating: {supermarket.rating}</span>
										<span style={supermarket.pfandtastic.isOperational ? {color: '#a5d6a7'} : {color: '#e57373'}}>
											{supermarket.pfandtastic.isOperational ? 'Pfand Machine Operational' : 'Pfand Machine Not Operational'}
										</span>
										<Button variant="contained" style={{backgroundColor: '#fff', color: '#74f9b9'}}>
											<NavLink to={`/map/pfandautomat/${supermarket._id}`}>PFANDAutomat Details </NavLink>
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
