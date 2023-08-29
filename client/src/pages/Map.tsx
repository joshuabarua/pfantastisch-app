import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

const Map = () => {
	const [userCoords, setUserCoords] = useState<{latitude: number | null; longitude: number | null}>({
		latitude: null,
		longitude: null,
	});

	const getUserLocation = () => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserCoords(position.coords);
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
		<>
			<h1> Map</h1>
			<p>{`${userCoords.latitude} ${userCoords.longitude}`}</p>
		</>
	);
};

export default Map;
