import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {NotOk, Supermarket} from '../@types';

// type Props = {};

export default function PfandMachine() {
	const {id} = useParams();
	const [pfandMachine, setPfandMachine] = useState<Supermarket | null>(null);
	const [loading, setLoading] = useState(true);

	function renderStars(rating: number) {
		const maxStars = 5; // You can change this value to determine the maximum number of stars
		const roundedRating = Math.round(rating); // Round the rating to the nearest whole number
		const stars = [];

		for (let i = 1; i <= maxStars; i++) {
			if (i <= roundedRating) {
				stars.push(
					<span key={i} style={{color: '#ffff00'}}>
						&#9733;
					</span>
				);
			}
		}

		return stars;
	}

	useEffect(() => {
		const fetchPfandMachineData = async (id: string) => {
			const baseURL = import.meta.env.VITE_SERVER_BASE as string;
			try {
				const response = await fetch(`${baseURL}api/businesses/supermarketById/${id}`);
				if (!response.ok) {
					const result = (await response.json()) as NotOk;
					toast.error(`Something went wrong - ${result.error}, ${response.status}`);
					console.log(result.error, response.status);
					throw new Error(`Request failed with status: ${response.status}`);
				}
				const result = await response.json();
				setPfandMachine(result);
				setLoading(false); // Data loading completed
			} catch (error) {
				console.error(error);
				setLoading(false); // Data loading completed with error
			}
		};

		if (id) fetchPfandMachineData(id);
	}, [id]);

	return (
		<div className='centeredDiv' style={{justifyContent: 'flex-start', flexDirection: 'column', width: '100vw'}}>
			<h1>Pfand Machine Details</h1>
			{loading || !pfandMachine ? (
				<p>Loading...</p>
			) : (
				<div className='centeredDiv' style={{flexDirection: 'column', width: '100vw', gap: 20}}>
					<img
						src={!pfandMachine.pfandtastic.machine_img_url[0] ? '/src/assets/imgs/bottle-automat.png' : pfandMachine.pfandtastic.machine_img_url[0]}
						style={{width: '200px', height: '200px', borderRadius: '50%'}}></img>
					<div className='centeredDiv' style={{display: 'flex', flexDirection: 'row', width: '100vw', gap: 10}}>
						<img src={!pfandMachine.image_url ? '/src/assets/icons/commerce.png' : pfandMachine.image_url} style={{width: '60px', height: '60px', borderRadius: '10%'}}></img>
						<h3> {pfandMachine.name}</h3>
					</div>
					<div className='centeredDiv' style={{flexDirection: 'column'}}>
						{pfandMachine.pfandtastic.isOperational ? (
							<span className='blink' style={{color: '#81c784'}}>
								{' '}
								• Pfandautomat Online{' '}
							</span>
						) : (
							<span className='blink' style={{color: '#e57373'}}>
								{' '}
								• Maintainence Needed{' '}
							</span>
						)}
						<span>{renderStars(pfandMachine.rating)}</span>
						<span> {`${pfandMachine.location.address1}, ${pfandMachine.location.city}, ${pfandMachine.location.zip_code}, ${pfandMachine.location.country}`}</span>
						{pfandMachine.phone && <span>Phone: {pfandMachine.phone}</span>}
					</div>
					<p>Comments system go here</p>
				</div>
			)}
		</div>
	);
}
