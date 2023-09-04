import {useEffect} from 'react';
import {useMap} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import {LatLongLocation} from '../@types';

interface Props {
	sourceLocation: LatLongLocation;
	destinationLocation?: LatLongLocation;
}

//Page nolonger used
const Routing = ({sourceLocation, destinationLocation}: Props) => {
	L.Marker.prototype.options.icon = L.icon({
		iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
	});

	const leafletMap = useMap();

	useEffect(() => {
		if (!leafletMap) return;

		if (sourceLocation?.latitude !== undefined && destinationLocation?.latitude !== undefined) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			const routingControl = L.Routing.control({
				waypoints: [L.latLng(sourceLocation.latitude, sourceLocation.longitude), L.latLng(destinationLocation.latitude, destinationLocation.longitude)],
				routeWhileDragging: true,
				lineOptions: {
					styles: [{color: '#6FA1EC', weight: 4}],
				},
				show: true,
				showAlternatives: true,
				addWaypoints: true,
				fitSelectedRoutes: true,
			}).addTo(leafletMap);
			return () => {
				leafletMap.removeControl(routingControl);
			};
		}
	}, [leafletMap, sourceLocation, destinationLocation]);
};

export default Routing;
