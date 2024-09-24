import {useEffect, useState} from 'react';
import './App.css';
import {Users} from './@types';
import UserCard from './components/UserCard';
import CreateUserForm from './components/CreateUserForm';
import Login from './pages/Login';

function App() {
	const baseURL = import.meta.env.VITE_SERVER_BASE;
	const [users, setUsers] = useState<Users>([]);

	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				const response = await fetch(`${baseURL}api/users/all`);
				const result = (await response.json()) as Users;
				setUsers(result);
			} catch (error) {
				console.log(error);
			}
		};

		fetchAllUsers().catch((e) => console.log(e));
	}, []);
	return (
		<>
			<div></div>
			<h1>MERN</h1>

			{users.length === 0 ? (
				<p>No Users 😞</p>
			) : (
				<>
					<h2>My current users are:</h2>
					{users.map((u) => {
						return <UserCard key={u._id} user={u} />;
					})}
				</>
			)}
			<CreateUserForm setUsers={setUsers} users={users} />
			<Login />
		</>
	);
}

export default App;
