import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const encryptPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

export const verifyPassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
