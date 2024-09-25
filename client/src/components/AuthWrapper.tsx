import { useEffect } from 'react';
import { useAuthStore } from '../context/AuthState';
import { toast } from 'react-toastify';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const { getActiveUser, user } = useAuthStore();

	useEffect(() => {
		const fetchUser = async () => {
			await getActiveUser();
			if (!user) {
				toast.info('You are not logged in');
			}
		};
		fetchUser();
	}, [getActiveUser, user]);

	return <>{children}</>;
};

export default AuthWrapper;
