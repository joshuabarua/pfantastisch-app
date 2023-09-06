import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {Comments, NotOk, Supermarket} from '../@types';

function usePfandMachineFetch(id: string) {
	const [loading, setLoading] = useState(true);
	const [pfandMachine, setPfandMachine] = useState<Supermarket | null>(null);
	const [comments, setComments] = useState([] as Comments);

	//TODO: Internal Server Error
	const getPfandMachineData = async () => {
		const baseURL = import.meta.env.VITE_SERVER_BASE as string;
		try {
			const response = await fetch(`${baseURL}api/businesses/supermarketById/${id}`);
			if (!response.ok) {
				const result = (await response.json()) as NotOk;
				toast.error(`getPfandError - ${result.error}, code: ${response.status}`);
				console.log(result.error, response.status);
				throw new Error(`Request failed with status: ${response.status}`);
			}
			const result = await response.json();
			setPfandMachine(result);
			setComments(result.comments);
			setLoading(false); // Data loading completed
		} catch (error) {
			console.error(error);
			setLoading(false); // Data loading completed with error
		}
	};

	useEffect(() => {
		getPfandMachineData();
	}, [id]);
	return {pfandMachine, comments, setComments, loading, setLoading};
}

export default usePfandMachineFetch;
