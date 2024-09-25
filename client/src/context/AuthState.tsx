import {toast} from 'react-toastify';
import getToken from '../utils/getToken';
import {NotOk, User} from '../@types';
import {create} from 'zustand';

interface AuthState {
	user: User | null;
	setUser: (user: User | null) => void;
	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string, username: string, profilePicFile: File | null) => Promise<void>;
	update: (updateFields: {email: string; password: string; username: string; profilePicFile: File | null}) => Promise<void>;
	logout: () => void;
	getActiveUser: () => Promise<void>;
}

const baseURL = import.meta.env.VITE_SERVER_BASE as string;


export const useAuthStore = create<AuthState>((set) => {
	return {
		user: null,

		
		setUser: (user) => set({user}),
		signup: async (email, password, username, profilePicFile) => {
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
					const result = (await response.json()) as {user: User; token: string};
					localStorage.setItem('token', result.token);
					localStorage.setItem('user', JSON.stringify(result.user));
					set({user: result.user});
					toast.success('Signup Successful, logging in...');
					setTimeout(() => (window.location.href = '/'), 2000); // Redirect after a delay
				} else {
					const result = (await response.json()) as NotOk;
					toast.error(`Something went wrong - ${result.error}`);
				}
			} catch (e) {
				toast.error(` ${e as Error}`);
			}
		},

		update: async (updateFields) => {
			const formData = new FormData();
			const {email, password, username, profilePicFile} = updateFields;

			if (username) formData.append('username', username);
			if (email) formData.append('email', email);
			if (password) formData.append('password', password);
			if (profilePicFile) formData.append('image_url', profilePicFile);

			const token = getToken();

			if (!token) {
				toast.error('Authentication token not found. Please log in again.');
				return;
			}

			const requestOptions = {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			};

			try {
				const response = await fetch(`${baseURL}api/users/update-user`, requestOptions);
				if (response.ok) {
					const result = (await response.json()) as {user: User};
					toast.success('User updated successfully');
					set({user: result.user});
					setTimeout(() => (window.location.href = '/myprofile'), 2000);
				} else {
					const result = (await response.json()) as NotOk;
					toast.error(`Update failed: ${result.error}`);
				}
			} catch (e) {
				toast.error(`Update failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
				console.error('Error updating user:', e);
			}
		},

		login: async (email, password) => {
			const myHeaders = new Headers({
				'Content-Type': 'application/x-www-form-urlencoded',
			});
			const urlencoded = new URLSearchParams({email, password});
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
					const result = (await response.json()) as {user: User; token: string};
					localStorage.setItem('token', result.token);
					localStorage.setItem('user', JSON.stringify(result.user));
					toast.success('Login Successful');
					set({user: result.user});
					console.log(result.user);
					setTimeout(() => (window.location.href = '/'), 2000);
				}
			} catch (error) {
				toast.error(`${error as Error}`);
			}
		},

		logout: () => {
			set({user: null});
			localStorage.removeItem('token');
			toast.success('Logging out... Cya!');
		},

		getActiveUser: async () => {
			const token = getToken();
			if (!token) {
				set({user: null});
				return;
			}

			try {
				const myHeaders = new Headers({Authorization: `Bearer ${token}`});
				const requestOptions = {
					method: 'GET',
					headers: myHeaders,
				};
				const response = await fetch(`${baseURL}api/users/me`, requestOptions);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = (await response.json()) as User;
				set({user: result});
			} catch (error) {
				if (error instanceof Error) {
					toast.error(`Failed to get user: ${error.message}`);
					console.error('Error fetching user:', error);
				} else {
					toast.error('An unexpected error occurred');
					console.error('Unexpected error:', error);
				}
				set({user: null});
			}
		},
	};
});
