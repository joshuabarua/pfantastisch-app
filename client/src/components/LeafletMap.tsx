import React from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {NavLink} from 'react-router-dom';
import Button from '@mui/material/Button';
import {Supermarket, LatLongLocation} from '../@types';
import {Icon} from 'leaflet';
import userPin from '../assets/icons/user-pin.png';
import bottle from '../assets/icons/plastic-bottle.png';

const maps = {base: 'https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?'};

const customIcon = (icon: string) => {
	return new Icon({
		iconUrl: icon,
		iconSize: [60, 60],
	});
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
				margin: '0px 10px -200px 50px',
				zIndex: 0,
			}}>
			<h1 style={{padding: '20px', margin: 0, textAlign: 'right', fontSize: '24px'}}> Map</h1>
			<div style={{flex: 1, position: 'relative'}}>
				<MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={16} style={{width: '100%', height: '90vh'}}>
					<TileLayer
						url={`${maps.base}access-token=${import.meta.env.VITE_JAWG_MAP_ACCESS_TOKEN}`}
						attribution={
							'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						}
						minZoom={15}
						maxZoom={16}
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
