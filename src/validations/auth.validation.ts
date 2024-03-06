import Joi from 'joi';
import { objectId, password } from './custom.validation';

export const register = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
		name: Joi.string().required(),
		technologies: Joi.array().items(Joi.string().custom(objectId)).min(1),
	}),
};

export const login = {
	body: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
	}),
};

export const logout = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

export const refreshTokens = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

export const forgotPassword = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
	}),
};

export const resetPassword = {
	query: Joi.object().keys({
		token: Joi.string().required(),
	}),
	body: Joi.object().keys({
		password: Joi.string().required().custom(password),
	}),
};

export default {
	register,
	login,
	logout,
	refreshTokens,
	forgotPassword,
	resetPassword,
};
