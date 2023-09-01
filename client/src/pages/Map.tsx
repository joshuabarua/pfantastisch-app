import {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import LeafletMap from '../components/LeafletMap';
import {getUserLocation} from '../utils/getLocationUtils';
import {NotOk, Supermarket} from '../@types';
import {toast} from 'react-toastify';

interface Coordinates {
	latitude: number;
	longitude: number;
}

const Map = () => {
	const [userCoords, setUserCoords] = useState<{latitude: number; longitude: number}>({
		latitude: 52.52,
		longitude: 13.405,
	});
	const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
	const [loading, setLoading] = useState<boolean>(true); // Add loading state

	useEffect(() => {
		const fetchSupermarketData = async (coords: Coordinates) => {
			const baseURL = import.meta.env.VITE_SERVER_BASE as string;
			const {longitude, latitude} = coords;
			try {
				const response = await fetch(`${baseURL}api/businesses/supermarketsWithPfandAutomat?longitude=${longitude}&latitude=${latitude}`);
				if (!response.ok) {
					const result = (await response.json()) as NotOk;
					toast.error(`Something went wrong - ${result}, ${response.status}`);
					throw new Error(`Request failed with status: ${response.status}`);
				}
				const result = await response.json();
				setSupermarkets(result);
				setLoading(false); // Data loading completed
			} catch (error) {
				console.error(error);
				setLoading(false); // Data loading completed with error
			}
		};

		getUserLocation(
			(coords) => {
				setUserCoords({latitude: coords.latitude, longitude: coords.longitude});
				fetchSupermarketData(coords);
			},
			(error: GeolocationPositionError) => {
				console.log(error);
				setLoading(false); // Data loading completed with error
			}
		);
	}, []);

	return (
		<div className='centeredDiv' style={{flexDirection: 'column', width: '100%'}}>
			<h1> Map</h1>
			{loading ? (
				<p>Loading...</p> // Display loading indicator
			) : (
				<>
					<LeafletMap userLocation={userCoords} supermarkets={supermarkets} />
					<p>{`${userCoords.latitude.toFixed(3)} ${userCoords.longitude.toFixed(3)} `}</p>
				</>
			)}
		</div>
	);
};

export default Map;
