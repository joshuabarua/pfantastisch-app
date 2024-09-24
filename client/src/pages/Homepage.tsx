import bottlesImage from '../assets/imgs/btls.jpeg';

const Homepage = () => {
	return (
		<div>
			{/* <div className="centeredDiv" style={{}}>
				<img src={bottlesImage} style={{minWidth: '320px', width: '100%', marginTop: '-60px', height: '100%', objectFit: 'contain', zIndex: -1}} alt="Pfantastisch Image" />
			</div> */}
			<div
				className="centeredDiv"
				style={{
					height: '100vh',
					width: '100vw',
					gap: '20px',
					marginTop: -60,
					padding: '20px',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					zIndex: -1,
					backgroundImage: `url(${bottlesImage})`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundBlendMode: 'overlay',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					position: 'relative',
				}}>
				<div
					className="centeredDiv"
					style={{
						display: 'flex',
						flexDirection: 'column',
						padding: '10vw',
					}}>
					<h1 style={{fontSize: ' clamp(3rem, 10vw, 10rem)', color: 'white', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'}}>Pfandtastisch!</h1>
					<h4 style={{fontSize: 'clamp(1.5rem, 2vw, 3rem)', color: 'white', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'}}>
						Recycling made simple, rewarding, and eco-friendly!
					</h4>
					<p style={{fontSize: 'clamp(1rem, 2vw, 2rem)', color: 'white', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'}}>
						Discover Pfandtastisch, your ultimate companion for hassle-free recycling. Find nearby pfand-automats with ease, check machine status in real time, and join a
						community that's turning recycling into a movement. Together, we’ll conserve resources, reduce waste, and create a greener future for all. Let's make recycling a
						rewarding experience—join Pfandtastisch today!
					</p>
				</div>
			</div>
		</div>
	);
};

export default Homepage;
