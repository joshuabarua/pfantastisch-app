const Homepage = () => {
	return (
		<div className="centeredDiv" style={{display: 'flex', width: '100vw', height: '100vh', padding: '50px'}}>
			<div className="centeredDiv" style={{flex: '1', overflow: 'hidden'}}>
				<img src={'/src/assets/imgs/bottles.jpg'} style={{minWidth: '200px', width: '100%', height: '100%', objectFit: 'contain'}} alt="Pfantastisch Image" />
			</div>
			<div
				className="centeredDiv"
				style={{
					display: 'flex',
					flex: '1',
					flexDirection: 'column',
					padding: '50px',
				}}>
				<h1 style={{fontSize: '2rem'}}>Pfantastisch!</h1>
				<p
					style={{
						fontSize: '0.7rem',
					}}>
					Discover Pfantastisch: Your Ultimate Pfand-Automat Companion Welcome to Pfantastisch, where we redefine bottle and can recycling. We're your go-to solution,
					transforming recycling into an eco-conscious, rewarding experience. Pfantastisch is your portal to locating nearby pfand-automats—those magical devices refunding
					your "pfand" deposit when recycling. Our user-friendly map feature effortlessly guides you to the nearest recycling machine, simplifying the process.
				</p>
				<p
					style={{
						fontSize: '0.7rem',
					}}>
					At Pfantastisch, we're not just about convenience; we're also all about community. We believe that together, we can make a significant impact on the environment.
					That's why we've created a space where like-minded individuals can come together, share their recycling success stories, and inspire others to join the green
					revolution. One of our standout features is the ability to report machine statuses. We understand that there's nothing more frustrating than trekking to a recycling
					machine only to find it out of order. With Pfantastisch, you can check in real-time whether a machine is online or not, saving you time and ensuring you have a
					smooth recycling experience. But that's not all – Pfantastisch is committed to making the world a better place. We're constantly working on partnerships and
					initiatives to further promote recycling and sustainability.
				</p>
				<p
					style={{
						fontSize: '0.7rem',
					}}>
					Together, we can reduce waste, conserve resources, and leave a greener planet for future generations. So, why wait? Join the Pfantastisch community today and embark
					on a recycling journey like no other. Together, we'll make recycling not just a duty but a delightful experience. Start finding those pfand-automats, getting your
					deposits back, and contributing to a cleaner, healthier planet – it's all possible with Pfantastisch! Join us in making recycling Pfantastisch!
				</p>
			</div>
		</div>
	);
};

export default Homepage;
