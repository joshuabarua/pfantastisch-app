export interface User {
	_id: string;
	email: string;
	username: string;
	image_url: string;
	createdAt: string;
}

export type Users = User[];

export interface LatLongLocation {
	latitude: number;
	longitude: number;
}

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
	_id: string;
	alias: string;
	name: string;
	image_url: string;
	review_count: number;
	rating: number;
	latitude: number;
	longitude: number;
	coordinates: Coordinates;
	display_address: string[];
	location: Location;
	phone: string;
	pfandtastic: Pfandtastic;
	comments: Comments;
}

export interface Pfandtastic {
	has_pfand_automat: boolean;
	isOperational: boolean;
	machine_img_url?: string[];
	status_updated_at?: string;
}

export interface Comment {
	_id: string;
	createdAt: string;
	comment: string;
	likes: string[];
	posted_by: UserPostingComment | null;
}

export interface UserPostingComment {
	username: string;
	_id: string;
	image_url: string;
}

export type Comments = Comment[];
