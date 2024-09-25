import React from 'react';
import Button from '@mui/material/Button';
import {Supermarket} from '../@types';

interface SidebarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (isOpen: boolean) => void;
	supermarkets?: Supermarket[];
	handleMarkerClick: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({isSidebarOpen, setIsSidebarOpen, supermarkets, handleMarkerClick}) => {
	return (
		<div
			style={{
				position: 'absolute',
				left: -0,
				top: 0,
				bottom: 0,
				width: '250px',
				borderRight: '1px solid #e0e0e0',
				boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
				backgroundColor: 'whitesmoke',
				display: 'flex',
				flexDirection: 'column',
				zIndex: 1000,
				transition: 'transform 0.3s ease-in-out',
				transform: `translateX(${isSidebarOpen ? '-10px' : '-210px'})`,
			}}>
			<div
				style={{
					position: 'absolute',
					right: '-55px',
					top: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '40px',
					height: '80px',
					backgroundColor: 'whitesmoke',
					borderRadius: '0 5px 5px 0',
					cursor: 'pointer',
					boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
					transition: 'transform 0.3s ease-in-out',
					transform: `translateX(-20px) translateY(-50%)`,
				}}
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					{isSidebarOpen ? '◀' : '▶'}
				</div>
				<h1
					style={{
						position: 'absolute',
						right: '60px',
						top: '-80%',
						transform: 'translateY(0%) rotate(-90deg)',
						transformOrigin: 'right center',
						whiteSpace: 'nowrap',
						fontSize: '20px',
						opacity: isSidebarOpen ? 0 : 1,
						transition: 'opacity 0.5s ease-in-out',
					}}>
					Pfandautomats
				</h1>
			</div>
			<div
				style={{
					height: '100%',
					overflowY: 'auto',
					padding: '20px',
					opacity: isSidebarOpen ? 1 : 0,
					transition: 'opacity 1s ease-in-out',
					pointerEvents: isSidebarOpen ? 'auto' : 'none',
				}}>
				{isSidebarOpen && <h1 style={{fontSize: '24px'}}>Pfandautomats</h1>}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
						gridGap: '10px',
						width: '100%',
						justifyItems: 'center',
					}}>
					{supermarkets &&
						supermarkets.map((supermarket, index) => (
							<Button
								key={supermarket._id}
								variant="outlined"
								onClick={() => handleMarkerClick(index)}
								style={{width: '170px', height: '100px', lineHeight: '1.2', borderColor: '#4e1d21', color: '#4e1d21'}}>
								<div className="centeredDiv" style={{flexDirection: 'column'}}>
									<strong>{supermarket.name}</strong> {supermarket.display_address}
								</div>
							</Button>
						))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
