import {useState} from 'react';
import {Businesses, NotOk} from '../@types';
import {toast} from 'react-toastify';
import * as supermarkets from '../json/pfandAutomats.json';

/*  
Needs to be called inside of a useEffect, might need to have an offset state in the component using it for it to work in a useEfect, in this case, add a parameter/prop of offset and setOffset instead and call those. 
*/
const useFetchSupermarketData = async () => {
	const baseURL = import.meta.env.VITE_SERVER_BASE as string;
	const [offset, setOffset] = useState(0);
	const [supermarkets, setSupermarkets] = useState<Businesses[]>([]);

	try {
		const response = await fetch(`${baseURL}api/businesses/all?offset=${offset}`);
		if (!response.ok) {
			const result = (await response.json()) as NotOk;
			toast.error(`Something went wrong - ${result}`);
			throw new Error(`Request failed with status: ${response.status}`);
		}

		const result = await response.json();
		console.log(result);
		setSupermarkets((prevSupermarkets) => [
			...prevSupermarkets,
			result.businesses,
		]);
		console.log(supermarkets);

		// Automatically increment offset until 650
		if (offset + 50 <= 650) {
			setOffset(offset + 50);
		}
	} catch (error) {
		console.error('Error:', error);
	}
};

//Use this to create a new field in json data to update collections in mongo
const updateSuperMarketsJson = () => {
	const updated = supermarkets.businesses.map((business) => ({
		...business,
		pfandtastic: {},
	}));
	console.log(updated);
};

export {useFetchSupermarketData, updateSuperMarketsJson};
