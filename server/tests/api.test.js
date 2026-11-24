import {test, describe, beforeEach, afterEach} from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';

process.env.JWT_SECRET = 'test-secret';

const {createApp} = await import('../app.js');
const {userModel} = await import('../models/userModel.js');
const {commentModel} = await import('../models/commentModel.js');
const {supermarketModel} = await import('../models/supermarketModel.js');
const {generateToken} = await import('../utils/jwt.js');
const {encryptPassword} = await import('../utils/bcrypt.js');

// Models are stubbed per test so no database is needed.
const originals = [];
const stub = (obj, key, impl) => {
	originals.push([obj, key, obj[key]]);
	obj[key] = impl;
};
const chainable = (value) => ({select: async () => value, populate: async () => value, then: (r, j) => Promise.resolve(value).then(r, j)});

const app = createApp();
const userId = new mongoose.Types.ObjectId();
const otherUserId = new mongoose.Types.ObjectId();
const user = {_id: userId, email: 'a@b.de', username: 'anna', image_url: 'x.png', createdAt: new Date()};
const token = generateToken(user);
const auth = {Authorization: `Bearer ${token}`};

beforeEach(() => {
	stub(userModel, 'findById', (id) => chainable(String(id) === String(userId) ? {...user} : null));
});
afterEach(() => {
	while (originals.length) {
		const [obj, key, value] = originals.pop();
		obj[key] = value;
	}
});

describe('auth required', () => {
	for (const [method, path] of [
		['get', '/api/users/me'],
		['patch', '/api/users/me'],
		['post', `/api/businesses/supermarkets/${userId}/comments`],
		['delete', `/api/businesses/comments/${userId}`],
		['patch', `/api/businesses/supermarkets/${userId}/status`],
	]) {
		test(`${method.toUpperCase()} ${path} rejects anonymous requests`, async () => {
			const res = await request(app)[method](path);
			assert.equal(res.status, 401);
			assert.ok(res.body.error);
		});
	}

	test('removed admin/migration endpoints are gone', async () => {
		for (const [method, path] of [
			['get', '/api/users/all'],
			['put', '/api/users/updatePassword'],
			['post', '/api/users/addFieldsToUsers'],
			['put', '/api/businesses/updateSupermarketsWithTruthy/'],
			['put', '/api/businesses/updateSupermarketsWithField/'],
		]) {
			const res = await request(app)[method](path);
			assert.equal(res.status, 404, `${method} ${path}`);
		}
	});
});

describe('users', () => {
	test('GET /me never returns the password hash', async () => {
		stub(userModel, 'findById', () => chainable({...user, password: 'hash'}));
		const res = await request(app).get('/api/users/me').set(auth);
		assert.equal(res.status, 200);
		assert.equal(res.body.username, 'anna');
		assert.equal(res.body.password, undefined);
	});

	test('login gives the same error for unknown email and wrong password', async () => {
		const hash = await encryptPassword('Secret1');
		stub(userModel, 'findOne', ({email}) => chainable(email === user.email ? {...user, password: hash} : null));

		const unknown = await request(app).post('/api/users/login').send({email: 'nobody@b.de', password: 'Secret1'});
		const wrong = await request(app).post('/api/users/login').send({email: user.email, password: 'Wrong1'});
		assert.equal(unknown.status, 401);
		assert.equal(wrong.status, 401);
		assert.deepEqual(unknown.body, wrong.body);

		const ok = await request(app).post('/api/users/login').send({email: user.email, password: 'Secret1'});
		assert.equal(ok.status, 200);
		assert.ok(ok.body.token);
		assert.equal(ok.body.user.password, undefined);
	});

	test('signup validates password strength', async () => {
		const res = await request(app).post('/api/users/new').send({email: 'n@b.de', username: 'n', password: 'weak'});
		assert.equal(res.status, 400);
	});

	test('PATCH /me only updates the logged-in user and ignores unknown fields', async () => {
		let captured;
		stub(userModel, 'findByIdAndUpdate', async (id, update) => {
			captured = {id, update};
			return {...user, ...update.$set};
		});
		const res = await request(app)
			.patch('/api/users/me')
			.set(auth)
			.send({_id: otherUserId.toString(), username: 'new name', password_hash: 'x', image_url: 'evil'});
		assert.equal(res.status, 200);
		assert.equal(String(captured.id), String(userId));
		assert.deepEqual(captured.update, {$set: {username: 'new name'}});
		assert.equal(res.body.user.username, 'new name');
	});

	test('PATCH /me password change requires the current password', async () => {
		const hash = await encryptPassword('Secret1');
		stub(userModel, 'findById', () => chainable({...user, password: hash}));
		const res = await request(app).patch('/api/users/me').set(auth).send({password: 'NewSecret1', currentPassword: 'Wrong1'});
		assert.equal(res.status, 401);
	});
});

describe('businesses', () => {
	test('nearby search rejects invalid coordinates', async () => {
		const res = await request(app).get('/api/businesses/supermarketsWithPfandAutomat?longitude=abc&latitude=52');
		assert.equal(res.status, 400);
	});

	test('nearby search returns [] when nothing is found and uses numeric coordinates', async () => {
		let query;
		stub(supermarketModel, 'find', async (q) => {
			query = q;
			return [];
		});
		const res = await request(app).get('/api/businesses/supermarketsWithPfandAutomat?longitude=13.4&latitude=52.5&radius=2000');
		assert.equal(res.status, 200);
		assert.deepEqual(res.body, []);
		assert.deepEqual(query.loc.$near.$geometry.coordinates, [13.4, 52.5]);
		assert.equal(query.loc.$near.$maxDistance, 2000);
	});

	test('supermarketById rejects malformed ids', async () => {
		const res = await request(app).get('/api/businesses/supermarketById/not-an-id');
		assert.equal(res.status, 400);
	});

	test('adding a comment returns the populated comment', async () => {
		const supermarketId = new mongoose.Types.ObjectId();
		stub(supermarketModel, 'exists', async () => ({_id: supermarketId}));
		stub(supermarketModel, 'updateOne', async () => ({}));
		stub(userModel, 'updateOne', async () => ({}));
		stub(commentModel, 'create', async (doc) => ({...doc, _id: new mongoose.Types.ObjectId(), likes: [], createdAt: new Date()}));

		const res = await request(app).post(`/api/businesses/supermarkets/${supermarketId}/comments`).set(auth).send({comment: '  Works great  '});
		assert.equal(res.status, 201);
		assert.equal(res.body.comment.comment, 'Works great');
		assert.equal(res.body.comment.posted_by.username, 'anna');
	});

	test('empty comments are rejected', async () => {
		const res = await request(app).post(`/api/businesses/supermarkets/${userId}/comments`).set(auth).send({comment: '   '});
		assert.equal(res.status, 400);
	});

	test("users can't delete someone else's comment", async () => {
		const commentId = new mongoose.Types.ObjectId();
		stub(commentModel, 'findById', async () => ({_id: commentId, posted_by: otherUserId, supermarket: userId}));
		const res = await request(app).delete(`/api/businesses/comments/${commentId}`).set(auth);
		assert.equal(res.status, 403);
	});

	test('authors can delete their own comment', async () => {
		const commentId = new mongoose.Types.ObjectId();
		const calls = [];
		stub(commentModel, 'findById', async () => ({_id: commentId, posted_by: userId, supermarket: otherUserId}));
		stub(commentModel, 'deleteOne', async (q) => calls.push(['deleteOne', q]));
		stub(supermarketModel, 'updateOne', async (q, u) => calls.push(['supermarket', u]));
		stub(userModel, 'updateOne', async (q, u) => calls.push(['user', u]));
		const res = await request(app).delete(`/api/businesses/comments/${commentId}`).set(auth);
		assert.equal(res.status, 200);
		assert.equal(calls.length, 3);
	});

	test('status report requires a boolean', async () => {
		const res = await request(app).patch(`/api/businesses/supermarkets/${userId}/status`).set(auth).send({isOperational: 'yes'});
		assert.equal(res.status, 400);
	});
});

describe('cors', () => {
	test('allows the production client by default', async () => {
		const res = await request(app).get('/api/businesses/supermarketById/bad').set('Origin', 'https://pfandtastisch-app.vercel.app');
		assert.equal(res.headers['access-control-allow-origin'], 'https://pfandtastisch-app.vercel.app');
	});

	test('does not allow unknown origins', async () => {
		const res = await request(app).get('/api/businesses/supermarketById/bad').set('Origin', 'https://evil.example');
		assert.equal(res.headers['access-control-allow-origin'], undefined);
	});
});
