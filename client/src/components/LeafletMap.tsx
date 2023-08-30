import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import {Supermarket} from '../@types';
import {Icon} from 'leaflet';

interface Props {
	userLocation: {latitude: number; longitude: number};
	supermarkets?: Supermarket[];
}

const LeafletMap = (props: Props) => {
	const {userLocation, supermarkets} = props;

	const customIcon = new Icon({
		iconUrl: '/src/assets/icons/plastic-bottle.png',
		iconSize: [42, 42],
	});
	return (
		<MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={13} style={{width: '70vw', height: '70vh', minWidth: '300px'}}>
			<TileLayer
				url={`https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=${import.meta.env.VITE_JAWG_MAP_ACCESS_TOKEN}`}
				attribution={
					'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				}
				minZoom={12}
				maxZoom={18}
			/>
			{userLocation && (
				<Marker position={[userLocation.latitude, userLocation.longitude]}>
					<Popup>Your Location</Popup>
				</Marker>
			)}

			{supermarkets ? (
				supermarkets.map((supermarket, index) => (
					<Marker key={index} position={[supermarket.coordinates.latitude, supermarket.coordinates.longitude]} icon={customIcon}>
						<Popup>
							<div className='centeredDiv' style={{flexDirection: 'column', gap: 5}}>
								<h3>{supermarket.name}</h3>
								<img src={supermarket.image_url} style={{width: '120px', height: '120px', borderRadius: '25px'}} />
								<span>Rating: {supermarket.rating}</span>
								<span>Reviews: {supermarket.review_count}</span>
								<span>Phone: {supermarket.phone}</span>
								<span>{supermarket.distance}</span>
							</div>
						</Popup>
					</Marker>
				))
			) : (
				<></>
			)}
		</MapContainer>
	);
};

export default LeafletMap;
