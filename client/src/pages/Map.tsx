import {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import LeafletMap from '../components/LeafletMap';
import {getUserLocation} from '../utils/getLocationUtils';
import {NotOk, Supermarket} from '../@types';
import {toast} from 'react-toastify';

const Map = () => {
	const [userCoords, setUserCoords] = useState<{latitude: number; longitude: number}>({latitude: 52.52, longitude: 13.405});
	const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
//TODO: Modify the fetchFunct to use a utility function instead and callback to set data in map, prevent userLocation from being displayed more than once, save the location in localStorge?
	useEffect(() => {
		const fetchSupermarketData = async () => {
			const baseURL = import.meta.env.VITE_SERVER_BASE as string;
			try {
				const response = await fetch(`${baseURL}api/businesses/all?`);
				if (!response.ok) {
					const result = (await response.json()) as NotOk;
					toast.error(`Something went wrong - ${result}`);
					throw new Error(`Request failed with status: ${response.status}`);
				}

				const result = await response.json();
				setSupermarkets((prevSupermarkets) => [...prevSupermarkets, ...result.businesses]);
				return result.businesses;
			} catch (error) {
				console.error('Error:', error);
				return [];
			}
		};

		getUserLocation(
			(coords) => {
				setUserCoords({latitude: coords.latitude, longitude: coords.longitude});
			},
			(error: GeolocationPositionError) => {
				console.log(error);
			}
		);

		fetchSupermarketData();
	}, []);

	return (
		<div className='centeredDiv' style={{flexDirection: 'column', width: '100%'}}>
			<h1> Map</h1>
			<LeafletMap userLocation={userCoords} supermarkets={supermarkets} />
			<p>{`${userCoords.latitude.toFixed(3)} ${userCoords.longitude.toFixed(3)} `}</p>
		</div>
	);
};

export default Map;
