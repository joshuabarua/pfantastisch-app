/* eslint-disable react-refresh/only-export-components -- route config module, not a component file */
import {lazy, Suspense} from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';
import Login from './pages/Login.tsx';
import NavWrapper from './components/NavWrapper.tsx';
import Homepage from './pages/Homepage.tsx';
import Error404 from './pages/Error404.tsx';
import Signup from './pages/Signup.tsx';
import {ToastContainer} from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AuthWrapper from './components/AuthWrapper.tsx';
import AuthenticatedRoute from './components/AuthenticatedRoute.tsx';
import Loader from './components/Loader.tsx';

// Map/leaflet and MUI-heavy pages are loaded on demand to keep the initial bundle small.
const MapPage = lazy(() => import('./pages/MapPage.tsx'));
const PfandMachine = lazy(() => import('./pages/PfandMachine.tsx'));
const Profile = lazy(() => import('./pages/Profile.tsx'));

export const router = createBrowserRouter([
	{
		element: (
			<AuthWrapper>
				<Outlet />
			</AuthWrapper>
		),
		// putting context at outermost layer of router means it still wraps every route, but is also inside the router and can then use react router dom hooks like useNavigate
		children: [
			{
				element: (
					<NavWrapper>
						<ToastContainer />
						<Suspense fallback={<Loader />}>
							<Outlet />
						</Suspense>
					</NavWrapper>
				),
				children: [
					{
						path: '/',
						element: <Homepage />,
					},
					{
						element: <ProtectedRoute />,
						children: [
							{
								path: '/myprofile',
								element: <Profile />,
							},
						],
					},
					{
						path: '/map',
						element: <MapPage />,
					},
					{
						path: '/map/pfandautomat/:_id',
						element: <PfandMachine />,
					},
					{
						path: '/login',
						element: (
							<AuthenticatedRoute>
								<Login />
							</AuthenticatedRoute>
						),
					},
					{
						path: '/newUser',
						element: (
							<AuthenticatedRoute>
								<Signup />
							</AuthenticatedRoute>
						),
					},
				],
			},
			{
				path: '*',
				element: <Error404 />,
			},
		],
	},
]);
