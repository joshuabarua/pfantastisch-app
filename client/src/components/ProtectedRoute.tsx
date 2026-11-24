import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuthStore} from '../context/AuthState';
import Loader from './Loader';

const ProtectedRoute = () => {
	const user = useAuthStore((s) => s.user);
	const isAuthChecked = useAuthStore((s) => s.isAuthChecked);
	const location = useLocation();

	// Wait for the token check, otherwise a page refresh would bounce logged-in users to /login.
	if (!isAuthChecked) return <Loader />;
	if (!user) return <Navigate to="/login" replace state={{from: location.pathname}} />;

	return <Outlet />;
};

export default ProtectedRoute;
