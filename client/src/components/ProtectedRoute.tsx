import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useAuthStore} from '../context/AuthState';

const ProtectedRoute: React.FC = () => {
	const user = useAuthStore((state) => state.user);

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
