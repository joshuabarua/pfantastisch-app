import  {useRef} from 'react';
import bottlesImage from '../assets/imgs/btls.jpeg';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';
import {styled} from '@mui/material/styles';

const PageContainer = styled('div')({
	height: '100vh',
	width: '100vw',
	marginTop: -70,
	zIndex: -1,
	padding: '20px',
	display: 'flex',
	justifyContent: 'space-evenly',
	alignItems: 'center',
	backgroundImage: `url(${bottlesImage})`,
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	backgroundBlendMode: 'overlay',
	backgroundColor: 'rgba(0, 0, 0, 0.5)',
	position: 'relative',
});

const ContentContainer = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	padding: '10vw',
	color: 'whitesmoke',
	textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
});

const Title = styled('h1')({
	fontSize: 'clamp(3rem, 10vw, 10rem)',
});

const Subtitle = styled('h4')({
	fontSize: 'clamp(1.5rem, 2vw, 3rem)',
});

const Description = styled('p')({
	fontSize: 'clamp(1rem, 2vw, 2rem)',
	color: 'whitesmoke',
});

const Homepage = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (containerRef.current) {
				const elements = containerRef.current.children;
				gsap.from(elements, {
					y: 100,
					opacity: 0,
					duration: 1,
					ease: 'power3.out',
					stagger: 0.2, // Adjust this value to control the stagger timing
				});
			}
		},
		{scope: containerRef}
	);

	return (
		<PageContainer>
			<ContentContainer ref={containerRef}>
				<Title className="animate-item">Pfandtastisch!</Title>
				<Subtitle className="animate-item">Recycling made simple, rewarding, and eco-friendly!</Subtitle>
				<Description className="animate-item">
					Discover Pfandtastisch, your ultimate companion for hassle-free recycling. Find nearby pfand-automats with ease, check machine status in real time, and join a
					community that's turning recycling into a movement. Together, we'll conserve resources, reduce waste, and create a greener future for all. Let's make recycling a
					rewarding experience—join Pfandtastisch today!
				</Description>
			</ContentContainer>
		</PageContainer>
	);
};

export default Homepage;
