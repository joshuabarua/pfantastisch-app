import {useEffect, useState} from 'react';
import {Comments, Supermarket} from '../@types';
import {api, errorMessage} from '../utils/api';

function usePfandMachineFetch(id: string | undefined) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pfandMachine, setPfandMachine] = useState<Supermarket>();
	const [comments, setComments] = useState<Comments>([]);

	useEffect(() => {
		if (!id) return;
		const controller = new AbortController();
		setLoading(true);
		setError(null);

		api<Supermarket>(`/api/businesses/supermarketById/${id}`, {signal: controller.signal})
			.then((result) => {
				setPfandMachine(result);
				setComments(result.comments);
			})
			.catch((e: unknown) => {
				if (!controller.signal.aborted) setError(errorMessage(e));
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});

		return () => controller.abort();
	}, [id]);

	return {pfandMachine, setPfandMachine, comments, setComments, loading, error};
}

export default usePfandMachineFetch;
