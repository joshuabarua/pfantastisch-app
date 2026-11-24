import {toast} from 'react-toastify';
import {create} from 'zustand';
import {User} from '../@types';
import {api, ApiError, errorMessage} from '../utils/api';

export interface UpdateFields {
	email?: string;
	username?: string;
	password?: string;
	currentPassword?: string;
	profilePicFile?: File | null;
}

interface AuthState {
	user: User | null;
	/** True once the initial token check has finished, so routes don't redirect before we know who the user is. */
	isAuthChecked: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	signup: (fields: {email: string; password: string; username: string; profilePicFile: File | null}) => Promise<boolean>;
	update: (fields: UpdateFields) => Promise<boolean>;
	logout: () => void;
	getActiveUser: () => Promise<void>;
}

type AuthResponse = {user: User; token: string};

const storeSession = ({token}: AuthResponse) => {
	localStorage.setItem('token', token);
};

const clearSession = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('user'); // legacy key from older versions
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthChecked: false,

	signup: async ({email, password, username, profilePicFile}) => {
		const formData = new FormData();
		formData.append('username', username);
		formData.append('email', email);
		formData.append('password', password);
		if (profilePicFile) formData.append('image_url', profilePicFile);

		try {
			const result = await api<AuthResponse>('/api/users/new', {method: 'POST', body: formData});
			storeSession(result);
			set({user: result.user});
			toast.success('Signup successful, welcome!');
			return true;
		} catch (e) {
			toast.error(`Signup failed - ${errorMessage(e)}`);
			return false;
		}
	},

	login: async (email, password) => {
		try {
			const result = await api<AuthResponse>('/api/users/login', {method: 'POST', body: {email, password}});
			storeSession(result);
			set({user: result.user});
			toast.success('Login successful');
			return true;
		} catch (e) {
			toast.error(`Login failed - ${errorMessage(e)}`);
			return false;
		}
	},

	update: async ({email, username, password, currentPassword, profilePicFile}) => {
		const formData = new FormData();
		if (username) formData.append('username', username);
		if (email) formData.append('email', email);
		if (password) {
			formData.append('password', password);
			formData.append('currentPassword', currentPassword ?? '');
		}
		if (profilePicFile) formData.append('image_url', profilePicFile);

		try {
			const result = await api<{user: User}>('/api/users/me', {method: 'PATCH', body: formData, auth: true});
			set({user: result.user});
			toast.success('Profile updated');
			return true;
		} catch (e) {
			toast.error(`Update failed - ${errorMessage(e)}`);
			return false;
		}
	},

	logout: () => {
		clearSession();
		set({user: null});
		toast.success('Logged out. See you next time!');
	},

	getActiveUser: async () => {
		if (!localStorage.getItem('token')) {
			set({user: null, isAuthChecked: true});
			return;
		}
		try {
			const user = await api<User>('/api/users/me', {auth: true});
			set({user});
		} catch (e) {
			if (e instanceof ApiError && e.status === 401) {
				// Expired or invalid token: quietly log out.
				clearSession();
			} else {
				toast.error(`Couldn't load your account - ${errorMessage(e)}`);
			}
			set({user: null});
		} finally {
			set({isAuthChecked: true});
		}
	},
}));
