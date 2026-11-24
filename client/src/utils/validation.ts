// Keep in sync with server/controllers/userController.js
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
export const PASSWORD_RULE = 'At least 6 characters, including a number, a lowercase and an uppercase letter.';
