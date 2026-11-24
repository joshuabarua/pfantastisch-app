/** Shapes database documents into the objects sent to the client. Never include password hashes here. */

export const serializeUser = (user) => ({
	_id: user._id,
	email: user.email,
	username: user.username,
	image_url: user.image_url,
	createdAt: user.createdAt,
});

export const serializeAuthor = (user) => (user && user.username !== undefined ? {_id: user._id, username: user.username, image_url: user.image_url} : user);

export const serializeComment = (comment) => ({
	_id: comment._id,
	comment: comment.comment,
	likes: comment.likes,
	createdAt: comment.createdAt,
	posted_by: serializeAuthor(comment.posted_by),
});

export const serializeSupermarket = (supermarket) => ({
	_id: supermarket._id,
	alias: supermarket.alias,
	name: supermarket.name,
	image_url: supermarket.image_url,
	review_count: supermarket.review_count,
	rating: supermarket.rating,
	longitude: supermarket.coordinates?.longitude,
	latitude: supermarket.coordinates?.latitude,
	coordinates: supermarket.coordinates,
	display_address: supermarket.location?.display_address,
	location: supermarket.location,
	phone: supermarket.phone,
	pfandtastic: supermarket.pfandtastic,
	comments: (supermarket.comments || []).map((c) => (c && c.comment !== undefined ? serializeComment(c) : c)),
});
