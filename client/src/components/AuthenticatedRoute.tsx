import {Navigate, useLocation} from 'react-router-dom';
import {useAuthStore} from '../context/AuthState';

/** For pages only logged-out users should see (login, signup). Sends logged-in users back where they came from. */
const AuthenticatedRoute = ({children}: {children: React.ReactNode}) => {
	const user = useAuthStore((s) => s.user);
	const from = (useLocation().state as {from?: string} | null)?.from ?? '/';
	return user ? <Navigate to={from} replace /> : <>{children}</>;
};

export default AuthenticatedRoute;
