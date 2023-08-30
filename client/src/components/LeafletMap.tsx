import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import {Supermarket} from '../@types';

interface Props {
	userLocation: {latitude: number; longitude: number};
	supermarkets?: Supermarket[];
}

const LeafletMap = (props: Props) => {
	const {userLocation, supermarkets} = props;

	return (
		<MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={13} style={{width: '70vw', height: '70vh', minWidth: '300px'}}>
			<TileLayer
				url={`https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=${import.meta.env.VITE_JAWG_MAP_ACCESS_TOKEN}`}
				attribution={
					'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				}
				minZoom={0}
				maxZoom={22}
			/>
			{userLocation && (
				<Marker position={[userLocation.latitude, userLocation.longitude]}>
					<Popup>Your Location</Popup>
				</Marker>
			)}

			{supermarkets ? (
				supermarkets.map((supermarket, index) => (
					<Marker key={index} position={[supermarket.coordinates.latitude, supermarket.coordinates.longitude]}>
						<Popup>{supermarket.name}</Popup>
					</Marker>
				))
			) : (
				<></>
			)}
		</MapContainer>
	);
};

export default LeafletMap;
