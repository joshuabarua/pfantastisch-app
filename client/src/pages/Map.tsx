import {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import {toast} from 'react-toastify';
import LeafletMap from '../components/LeafletMap';

const Map = () => {
	const [userCoords, setUserCoords] = useState<{latitude: number; longtitude: number}>({latitude: 52.52, longtitude: 13.405});

	const getUserLocation = () => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserCoords({latitude: position.coords.latitude, longtitude: position.coords.longitude});
					toast.success(`< User Coordinates Received > 
                    Lat: ${position.coords.latitude.toFixed(3)} ||
                    Long: ${position.coords.longitude.toFixed(3)} 
                    `);
				},
				(e) => {
					toast.error(`Error getting user location:, ${e}`);
				}
			);
		} else {
			toast.error(`Geolocation is not available`);
			// Handle the case where geolocation is not supported
		}
	};

	// You can now use `globalUserLatitude` and `globalUserLongitude` elsewhere in your map.tsx file.

	useEffect(() => {
		getUserLocation();
	}, []);

	return (
		<div className='centeredDiv' style={{flexDirection: 'column', width: '100%'}}>
			<h1> Map</h1>
			<LeafletMap userLocation={userCoords} />
			<p>{`${userCoords.latitude.toFixed(3)} ${userCoords.longtitude.toFixed(3)} `}</p>
		</div>
	);
};

export default Map;
