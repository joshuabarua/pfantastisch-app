import {useEffect, useState} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {Users} from "./@types";

function App() {
	const baseURL = import.meta.env.VITE_SERVER_BASE;
	const [users, setUsers] = useState<Users>([]);
	console.log(baseURL);

	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				const response = await fetch(`${baseURL}api/users/all`);
				const result = (await response.json()) as Users;
				setUsers(result);
				console.log(users);
			} catch (error) {
				console.log(error);
			}
		};

		fetchAllUsers().catch((e) => console.log(e));
	}, []);

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
			<h1>Vite + React</h1>
		</>
	);
}

export default App;
