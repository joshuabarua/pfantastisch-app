import {useEffect, useRef, useState} from 'react';
import {useAuthStore} from '../context/AuthState';
import {toast} from 'react-toastify';

const useToastOnce = (condition: boolean, message: string) => {
	const hasShown = useRef(false);
	if (!hasShown.current && condition) {
		toast.info(message);
		hasShown.current = true;
	}
};

const AuthWrapper = ({children}: {children: React.ReactNode}) => {
	const {getActiveUser, user} = useAuthStore();
	const [hasCheckedUser, setHasCheckedUser] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			await getActiveUser();
			setHasCheckedUser(true);
		};
		fetchUser();
	}, [getActiveUser]);

	useToastOnce(hasCheckedUser && !user, `You're not logged in`);

	return <>{children}</>;
};

export default AuthWrapper;
