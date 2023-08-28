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

export interface Businesses {
	id: string;
	alias: string;
	name: string;
	image_url: string;
	is_closed: boolean;
	url: string;
	review_count: number;
	categories?: CategoriesEntity[] | null;
	rating: number;
	coordinates: Coordinates;
	transactions?: null[] | null;
	price: string;
	location: Location;
	phone: string;
	display_phone: string;
	distance: number;
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
