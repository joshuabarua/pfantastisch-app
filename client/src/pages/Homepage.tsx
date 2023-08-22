import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';

const Homepage = () => {
	const {user} = useContext(AuthContext);
	console.log(user);
	return (
		<div>
			<h1>This is my Homepage</h1>
		</div>
	);
};

export default Homepage;
