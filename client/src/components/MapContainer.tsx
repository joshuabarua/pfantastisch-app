import 'leaflet/dist/leaflet.css';
import {Supermarket, LatLongLocation} from '../@types';

import {useRef, useState} from 'react';
import Sidebar from './Sidebar';
import LeafletMap from './LeafletMap';

interface Props {
	userLocation: LatLongLocation;
	supermarkets?: Supermarket[];
}

const MapComponent = (props: Props) => {
	const {userLocation, supermarkets} = props;
	const markerRefs = useRef<(L.Marker | null)[]>([]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const handleMarkerClick = (index: number) => {
		const marker = markerRefs.current[index];
		if (marker) {
			marker.openPopup();
		}
	};
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				justifyContent: 'center',
				height: '100vh',
				width: '100%',
				position: 'relative',
				overflow: 'hidden',
			}}>
			<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} supermarkets={supermarkets} handleMarkerClick={handleMarkerClick} />
			<LeafletMap userLocation={userLocation} supermarkets={supermarkets} markerRefs={markerRefs} />
		</div>
	);
};

export default MapComponent;
