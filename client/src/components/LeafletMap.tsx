import React, {useEffect} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import {NavLink} from 'react-router-dom';
import Button from '@mui/material/Button';
import {Supermarket, LatLongLocation} from '../@types';
import {Icon, latLngBounds} from 'leaflet';
import userPin from '../assets/icons/user-pin.png';
import bottle from '../assets/icons/plastic-bottle.png';
import StoreImage from './StoreImage';

const maps = {base: 'https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?'};

const customIcon = (icon: string) => {
	return new Icon({
		iconUrl: icon,
		iconSize: [60, 60],
	});
};

/** Zooms the map out so the user and every result are visible. */
const FitToResults = ({userLocation, supermarkets}: {userLocation: LatLongLocation; supermarkets?: Supermarket[]}) => {
	const map = useMap();
	useEffect(() => {
		if (!supermarkets?.length) return;
		const bounds = latLngBounds([[userLocation.latitude, userLocation.longitude]]);
		supermarkets.forEach((s) => bounds.extend([s.coordinates.latitude, s.coordinates.longitude]));
		map.fitBounds(bounds, {padding: [60, 60], maxZoom: 16});
	}, [map, userLocation, supermarkets]);
	return null;
};

interface MapProps {
	userLocation: LatLongLocation;
	supermarkets?: Supermarket[];
	markerRefs: React.MutableRefObject<(L.Marker | null)[]>;
}

const LeafletMap: React.FC<MapProps> = ({userLocation, supermarkets, markerRefs}) => {
	return (
		<div
			style={{
				width: '100%',
				transition: 'width 0.3s ease-in-out',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				margin: '0px 10px 0px 50px',
				zIndex: 0,
			}}>
			<h1 style={{padding: '20px', margin: 0, textAlign: 'right', fontSize: '24px'}}> Map</h1>
			<div style={{flex: 1, position: 'relative'}}>
				<MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={16} style={{width: '100%', height: '100%'}}>
					<TileLayer
						url={`${maps.base}access-token=${import.meta.env.VITE_JAWG_MAP_ACCESS_TOKEN}`}
						attribution={
							'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						}
						minZoom={11}
						maxZoom={16}
					/>

					<FitToResults userLocation={userLocation} supermarkets={supermarkets} />

					{userLocation && (
						<Marker position={[userLocation.latitude, userLocation.longitude]} icon={customIcon(userPin)}>
							<Popup>Your Location</Popup>
						</Marker>
					)}

					{supermarkets ? (
						supermarkets.map((supermarket, index) => (
							<Marker
								key={supermarket._id}
								position={[supermarket.coordinates.latitude, supermarket.coordinates.longitude]}
								icon={customIcon(bottle)}
								ref={(el) => (markerRefs.current[index] = el)}>
								<Popup>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											gap: '10px',
											padding: '10px',
											maxWidth: '250px',
											fontFamily: 'Arial, sans-serif',
										}}>
										<h3 style={{margin: '0', color: '#333'}}>{supermarket.name}</h3>
										<StoreImage src={supermarket.image_url} alt={supermarket.name} size={150} />
										<div style={{fontSize: '14px', textAlign: 'center'}}>
											<p style={{margin: '5px 0'}}>
												{supermarket.location.address1}, {supermarket.location.city},<br />
												{supermarket.location.zip_code}, {supermarket.location.country}
											</p>
											{supermarket.phone && <p style={{margin: '5px 0'}}>Phone: {supermarket.phone}</p>}
											<p style={{margin: '5px 0'}}>Rating: {supermarket.rating} ⭐</p>
										</div>
										<div
											style={{
												padding: '5px 10px',
												borderRadius: '5px',
												color: supermarket.pfandtastic.isOperational ? '#a5d6a7' : '#e57373',
												fontWeight: 'bold',
												fontSize: '14px',
											}}>
											{supermarket.pfandtastic.isOperational ? 'Pfand Machine Operational' : 'Pfand Machine Not Operational'}
										</div>
										<Button
											component={NavLink}
											to={`/map/pfandautomat/${supermarket._id}`}
											variant="contained"
											style={{
												backgroundColor: '#4e1d21',
												color: '#fff',
												textTransform: 'none',
												fontWeight: 'bold',
												marginTop: '10px',
											}}>
											PFANDAutomat Details
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
