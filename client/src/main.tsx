import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AllUsers from './pages/AllUsers.tsx';
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom';
import Login from './pages/Login.tsx';
import {AuthContextProvider} from './context/AuthContext.tsx';
import NavWrapper from './components/NavWrapper.tsx';
import Homepage from './pages/Homepage.tsx';
import Map from './pages/Map.tsx';
import Error404 from './pages/Error404.tsx';
import Signup from './pages/Signup.tsx';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PfandMachine from './pages/PfandMachine.tsx';

const router = createBrowserRouter([
	{
		element: (
			<AuthContextProvider>
				<Outlet />
			</AuthContextProvider>
		),
		// putting context at outermost layer of router means it still wraps every route, but is also inside the router and can then use react router dom hooks like useNavigate

		children: [
			{
				element: (
					<NavWrapper>
						<ToastContainer style={{}} />
						<Outlet />
					</NavWrapper>
				),
				children: [
					{
						path: '/',
						element: <Homepage />,
					},
					{
						path: '/map',
						element: <Map />,
					},
					{
						path: '/map/pfandautomat/:id',
						element: <PfandMachine />,
					},
					{
						path: '/users',
						element: <AllUsers />,
					},
					{
						path: '/login',
						element: <Login />,
					},
					{
						path: '/newUser',
						element: <Signup />,
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

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
