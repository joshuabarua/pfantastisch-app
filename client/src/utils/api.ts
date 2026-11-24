import getToken from './getToken';

const baseURL = ((import.meta.env.VITE_SERVER_BASE as string | undefined) ?? '').replace(/\/+$/, '');

export class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

interface ApiOptions {
	method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	/** Plain objects are sent as JSON, FormData as multipart. */
	body?: unknown;
	/** Attach the stored Bearer token. */
	auth?: boolean;
	signal?: AbortSignal;
}

/** Fetches `path` (e.g. "/api/users/me") from the server and returns parsed JSON, throwing ApiError on non-2xx. */
export async function api<T>(path: string, {method = 'GET', body, auth = false, signal}: ApiOptions = {}): Promise<T> {
	const headers = new Headers();
	let payload: BodyInit | undefined;

	if (body instanceof FormData) {
		payload = body;
	} else if (body !== undefined) {
		headers.set('Content-Type', 'application/json');
		payload = JSON.stringify(body);
	}

	if (auth) {
		const token = getToken();
		if (!token) throw new ApiError(401, 'Please log in again.');
		headers.set('Authorization', `Bearer ${token}`);
	}

	const response = await fetch(`${baseURL}${path}`, {method, headers, body: payload, signal});
	const data: unknown = await response.json().catch(() => null);

	if (!response.ok) {
		const message = (data as {error?: string} | null)?.error ?? `Request failed (${response.status})`;
		throw new ApiError(response.status, message);
	}
	return data as T;
}

export const errorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Something went wrong');
