import {useEffect} from 'react';
import {useAuthStore} from '../context/AuthState';

const AuthWrapper = ({children}: {children: React.ReactNode}) => {
	const {getActiveUser} = useAuthStore();

	useEffect(() => {
		getActiveUser();
	}, [getActiveUser]);

	return <>{children}</>;
};

export default AuthWrapper;
