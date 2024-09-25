import {Navigate} from 'react-router-dom';
import {useAuthStore} from '../context/AuthState';
import {useEffect} from 'react';
import {toast} from 'react-toastify';

const AuthenticatedRoute = ({children}: {children: React.ReactNode}) => {
	const {user} = useAuthStore();

	useEffect(() => {
		if (user && localStorage.getItem('hasLoggedIn')) {
			toast.info("You're already signed in!", {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
		if (user) {
			localStorage.setItem('hasLoggedIn', 'true');
		}
	}, [user]);

	return user ? <Navigate to="/" replace /> : <>{children}</>;
};

export default AuthenticatedRoute;
