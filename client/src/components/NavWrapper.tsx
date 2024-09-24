import Nav from './Nav';

type Props = {
	children: React.ReactNode;
};

const navWrapperStyles: React.CSSProperties = {};

const NavWrapper = (props: Props) => {
	return (
		<div style={navWrapperStyles}>
			<Nav />
			{props.children}
		</div>
	);
};

export default NavWrapper;
