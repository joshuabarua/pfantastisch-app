import CircularProgress from '@mui/material/CircularProgress'; // You can use Material-UI's CircularProgress component or any other loading indicator library.

const Loader = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh', // Adjust the height as needed
				backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background to overlay the content
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 9999, // Ensure the loader is above other content
			}}>
			<CircularProgress color='primary' /> {/* Replace with your preferred loading indicator */}
		</div>
	);
};

export default Loader;
