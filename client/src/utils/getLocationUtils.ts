import {toast} from 'react-toastify';

interface UserCoords {
	latitude: number;
	longitude: number;
}

export const getUserLocation = (onSuccess: (coords: UserCoords) => void, onError: (error: GeolocationPositionError) => void) => {
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				toast.success(`User Coordinates Received`);
				onSuccess({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			},
			(error) => {
				toast.error(`Error getting user location: ${error.message}`);
				onError(error);
			}
		);
	} else {
		toast.error(`Geolocation is not available`);
		// Handle the case where geolocation is not supported
	}
};
