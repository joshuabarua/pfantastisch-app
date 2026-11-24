import {useEffect, useRef} from 'react';
import {toast} from 'react-toastify';
import {useAuthStore} from '../context/AuthState';

const AuthWrapper = ({children}: {children: React.ReactNode}) => {
	const getActiveUser = useAuthStore((s) => s.getActiveUser);
	const user = useAuthStore((s) => s.user);
	const isAuthChecked = useAuthStore((s) => s.isAuthChecked);
	const hasShownToast = useRef(false);

	useEffect(() => {
		void getActiveUser();
	}, [getActiveUser]);

	useEffect(() => {
		if (isAuthChecked && !user && !hasShownToast.current) {
			hasShownToast.current = true;
			toast.info(`You're not logged in`);
		}
	}, [isAuthChecked, user]);

	return <>{children}</>;
};

export default AuthWrapper;
