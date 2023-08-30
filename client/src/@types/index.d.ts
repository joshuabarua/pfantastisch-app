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

export interface CategoriesEntity {
	alias: string;
	title: string;
}
export interface Coordinates {
	latitude: number;
	longitude: number;
}
export interface Location {
	address1: string;
	address2?: string | null;
	address3?: string | null;
	city: string;
	zip_code: string;
	country: string;
	state: string;
	display_address?: string[] | null;
}

export interface Supermarket {
	id: string;
	alias: string;
	name: string;
	image_url: string;
	review_count: number;
	rating: number;
	latitude: number;
	longitude: number;
	coordinates: {
		latitude: number;
		longitude: number;
	};
	phone: string;
	distance: number;
	pfandtastic: Pfandtastic;
}

export interface Pfandtastic {
	has_pfand_automat: boolean;
	isOperational: boolean;
	machine_img_url: string[];
}
