import {useEffect, useState} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {Users} from "./@types";
import UserCard from "./components/UserCard";
import CreateUserForm from "./components/CreateUserForm";

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
	console.log(users);
	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
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
		</>
	);
}

export default App;
