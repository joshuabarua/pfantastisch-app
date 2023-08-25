export interface User {
	_id: string;
	email: string;
	password: string;
	username: string;
	image_url: string;
}

export type Users = User[];

export interface NotOk {
	error: string;
}
