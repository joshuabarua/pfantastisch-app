import {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import {toast} from 'react-toastify';
import Button from '@mui/material/Button';
import LeafletMap from '../components/MapContainer';
import Loader from '../components/Loader';
import {getUserLocation} from '../utils/getLocationUtils';
import {LatLongLocation, Supermarket} from '../@types';
import {api, errorMessage} from '../utils/api';

const BERLIN_CENTER: LatLongLocation = {latitude: 52.52, longitude: 13.405};
const RADIUS_STEPS_METERS = [900, 2000, 5000, 10000];

/** Removes duplicate entries for the same store (the data set contains some). */
const uniqueByAlias = (supermarkets: Supermarket[]) => {
	const seen = new Set<string>();
	return supermarkets.filter((s) => (seen.has(s.alias) ? false : (seen.add(s.alias), true)));
};

const formatDistance = (meters: number) => (meters >= 1000 ? `${meters / 1000} km` : `${meters} m`);

const MapPage = () => {
	const [userCoords, setUserCoords] = useState<LatLongLocation | null>(null);
	const [radiusIndex, setRadiusIndex] = useState(0);
	const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
	const [loading, setLoading] = useState(true);

	const radius = RADIUS_STEPS_METERS[radiusIndex];
	const canExpand = radiusIndex < RADIUS_STEPS_METERS.length - 1;

	useEffect(() => {
		getUserLocation(setUserCoords, () => {
			toast.info('Showing pfand machines around central Berlin instead.');
			setUserCoords(BERLIN_CENTER);
		});
	}, []);

	useEffect(() => {
		if (!userCoords) return;
		const controller = new AbortController();
		const {longitude, latitude} = userCoords;
		setLoading(true);

		api<Supermarket[]>(`/api/businesses/supermarketsWithPfandAutomat?longitude=${longitude}&latitude=${latitude}&radius=${radius}`, {signal: controller.signal})
			.then((result) => setSupermarkets(uniqueByAlias(result)))
			.catch((e: unknown) => {
				if (!controller.signal.aborted) toast.error(`Couldn't load pfand machines - ${errorMessage(e)}`);
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});

		return () => controller.abort();
	}, [userCoords, radius]);

	if (!userCoords) return <Loader />;

	return (
		<div style={{width: '100%', height: 'calc(100vh - 70px)', backgroundColor: 'whitesmoke', position: 'relative', overflow: 'hidden'}}>
			{loading && <Loader />}
			<LeafletMap userLocation={userCoords} supermarkets={supermarkets} />
			{!loading && (
				<div
					style={{
						position: 'fixed',
						bottom: 24,
						left: '50%',
						transform: 'translateX(-50%)',
						zIndex: 1000,
						backgroundColor: 'white',
						borderRadius: 12,
						boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
						padding: '10px 16px',
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						maxWidth: 'calc(100vw - 32px)',
						flexWrap: 'wrap',
						justifyContent: 'center',
					}}>
					<span>
						{supermarkets.length === 0
							? `No pfand machines found within ${formatDistance(radius)}.`
							: `${supermarkets.length} pfand machine${supermarkets.length === 1 ? '' : 's'} within ${formatDistance(radius)}`}
					</span>
					{canExpand && (
						<Button size="small" variant="contained" onClick={() => setRadiusIndex((i) => i + 1)} style={{backgroundColor: '#4e1d21'}}>
							Search {formatDistance(RADIUS_STEPS_METERS[radiusIndex + 1])}
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

export default MapPage;
