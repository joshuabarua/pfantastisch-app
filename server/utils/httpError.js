export class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

/** Wraps an async route handler so rejected promises reach the error middleware. */
export const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
