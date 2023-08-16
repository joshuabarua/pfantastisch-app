/* eslint-disable @typescript-eslint/no-misused-promises */
import {useState, FormEvent, ChangeEvent} from "react";
import {NotOk, User, Users} from "../@types";

function CreateUserForm({
	setUsers,
	users,
}: {
	users: Users;
	setUsers: React.Dispatch<React.SetStateAction<Users>>;
}) {
	const baseURL = import.meta.env.VITE_SERVER_BASE as string;
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const createUser = async () => {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
		const urlencoded = new URLSearchParams();
		urlencoded.append("email", email);
		urlencoded.append("password", password);
		urlencoded.append("username", username);
		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: urlencoded,
		};
		try {
			const response = await fetch(`${baseURL}api/users/new`, requestOptions);
			console.log(response);
			if (response.ok) {
				const result = (await response.json()) as User;
				alert("user created!");
				setUsers([...users, {...result}]);
			} else {
				const result = (await response.json()) as NotOk;
				alert(result.error);
			}
		} catch (e) {
			console.log(e);
			const {message} = e as Error;
			alert(message);
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log({email, username, password});
		await createUser();
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		// Update the corresponding state based on the input's name
		if (name === "email") {
			setEmail(value);
		} else if (name === "username") {
			setUsername(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			style={{display: "flex", flexDirection: "column", gap: 5}}
		>
			<h3>Create new User:</h3>
			<input
				type="email"
				name="email"
				value={email}
				placeholder="email"
				onChange={handleChange}
			/>
			<input
				type="username"
				name="username"
				value={username}
				placeholder="username"
				onChange={handleChange}
			/>
			<input
				type="password"
				name="password"
				value={password}
				placeholder="password"
				onChange={handleChange}
			/>
			<button>Create!</button>
		</form>
	);
}

export default CreateUserForm;
