import {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import LeafletMap from '../components/LeafletMap';
import {getUserLocation} from '../utils/getLocationUtils';
import {NotOk, Supermarket} from '../@types';
import {toast} from 'react-toastify';
import _ from 'lodash';
import Loader from '../components/Loader';

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
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchSupermarketData = async (coords: Coordinates) => {
			const baseURL = import.meta.env.VITE_SERVER_BASE as string;
			const {longitude, latitude} = coords;
			try {
				const response = await fetch(`${baseURL}api/businesses/supermarketsWithPfandAutomat?longitude=${longitude}&latitude=${latitude}`);
				if (!response.ok) {
					const result = (await response.json()) as NotOk;
					toast.error(`Something went wrong - ${result.error}, ${response.status}`);
					console.log(result.error, response.status);
					throw new Error(`Request failed with status: ${response.status}`);
				}
				const result = (await response.json()) as Supermarket[];
				const uniqueSupermarkets: Supermarket[] = _.uniqBy(result, 'alias');
				setSupermarkets(uniqueSupermarkets);
				setLoading(false);
			} catch (error) {
				console.error(error);
				setLoading(false);
			}
		};

		getUserLocation(
			(coords) => {
				setUserCoords({latitude: coords.latitude, longitude: coords.longitude});
				fetchSupermarketData(coords);
			},
			(error: GeolocationPositionError) => {
				console.log(error);
				setLoading(false);
			}
		);
	}, []);

	return (
		<div style={{width: '100vw', height: '100vh', backgroundColor: 'whitesmoke'}}>
			{loading ? (
				<Loader />
			) : (
				<>
					<LeafletMap userLocation={userCoords} supermarkets={supermarkets} />
					{/* <p>{`${userCoords.latitude.toFixed(3)} ${userCoords.longitude.toFixed(3)} `}</p> */}
				</>
			)}
		</div>
	);
};

export default Map;
