import {toast} from 'react-toastify';
import {LatLongLocation} from '../@types';

export const getUserLocation = (onSuccess: (coords: LatLongLocation) => void, onError: () => void) => {
	if (!('geolocation' in navigator)) {
		toast.error('Geolocation is not available in this browser');
		onError();
		return;
	}
	navigator.geolocation.getCurrentPosition(
		(position) => onSuccess({latitude: position.coords.latitude, longitude: position.coords.longitude}),
		(error) => {
			toast.error(`Couldn't get your location: ${error.message}`);
			onError();
		},
		{timeout: 10000}
	);
};
