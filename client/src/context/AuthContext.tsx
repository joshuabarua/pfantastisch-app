import {createContext, useState, ReactNode, useEffect} from 'react';
import {NotOk, User} from '../@types';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import getToken from '../utils/getToken';

interface DefaultValue {
	user: null | User;
	login: (email: string, password: string) => Promise<void>;

	signup: (email: string, password: string, username: string, profilePicFile: File | null) => Promise<void>;

	logout: () => void;
}

interface SignupResult {
	user: User;
	token: string;
}

interface LoginResult {
	verified: boolean;
	token: string;
	user: User;
}

const initialValue: DefaultValue = {
	user: null,
	login: () => {
		throw new Error('context not implemented.');
	},
	signup: () => {
		throw new Error('context not implemented.');
	},
	logout: () => {
		throw new Error('context not implemented.');
	},
};

export const AuthContext = createContext<DefaultValue>(initialValue);

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
	const baseURL = import.meta.env.VITE_SERVER_BASE as string;
	const [user, setUser] = useState<null | User>(null);
	// const [users, setUsers] = useState<null | User[]>(null);
	const redirect = useNavigate();

	const signup = async (email: string, password: string, username: string, profilePicFile: File | null) => {
		const formData = new FormData();
		formData.append('username', username);
		formData.append('email', email);
		formData.append('password', password);
		if (profilePicFile) {
			formData.append('image_url', profilePicFile);
		}
		const requestOptions = {
			method: 'POST',
			body: formData,
		};
		try {
			const response = await fetch(`${baseURL}api/users/new`, requestOptions);
			if (response.ok) {
				const result = (await response.json()) as SignupResult;
				const {token} = result as SignupResult;
				localStorage.setItem('token', token);
				localStorage.setItem('user', JSON.stringify(result.user));
				toast.success('Signup Successful, logging in...');
				setUser(result.user);
				setTimeout(() => redirect('/'), 2000);
			} else {
				const result = (await response.json()) as NotOk;
				toast.error(`Something went wrong - ${result.error}`);
			}
		} catch (e) {
			toast.error(` ${e as Error}`);
		}
	};

	const login = async (email: string, password: string) => {
		const myHeaders = new Headers({
			'Content-Type': 'application/x-www-form-urlencoded',
		});

		const urlencoded = new URLSearchParams({email: email, password: password});

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded,
		};
		try {
			const response = await fetch(`${baseURL}api/users/login`, requestOptions);
			if (!response.ok) {
				const result = (await response.json()) as NotOk;
				toast.error(`Something went wrong - ${result.error}`);
			} else {
				const result = (await response.json()) as LoginResult;
				const {token} = result as LoginResult;
				localStorage.setItem('token', token);
				localStorage.setItem('user', JSON.stringify(result.user));
				toast.success('Login Successful');
				setUser(result.user);
				setTimeout(() => redirect('/'), 2000);
			}
		} catch (error) {
			toast.error(`${error as Error}`);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('token');
		toast.success('Logging out... Cya!');
	};

	const getActiveUser = async () => {
		const token = getToken();
		console.log(token);
		if (token) {
			try {
				const myHeaders = new Headers({Authorization: `Bearer ${token}`});
				const requestOptions = {
					method: 'GET',
					headers: myHeaders,
				};
				const response = await fetch(`${baseURL}api/users/me`, requestOptions);
				const result = (await response.json()) as User;
				setUser(result);
			} catch (error) {
				toast.error(error as string);
				console.log(error);
			}
		} else {
			setUser(null);
		}
	};

	useEffect(() => {
		getActiveUser().catch((e) => console.log(e));
	}, []);

	return <AuthContext.Provider value={{user, signup, login, logout}}>{children}</AuthContext.Provider>;
};
