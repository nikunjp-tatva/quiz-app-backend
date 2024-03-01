import Joi from 'joi';
import { password, objectId } from './custom.validation';
import { ROLES } from '../config/constant';

export const createUser = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
		name: Joi.string().required(),
		role: Joi.string().valid(...Object.values(ROLES)),
	}),
};

export const getUsers = {
	query: Joi.object().keys({
		name: Joi.string(),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

export const getUser = {
	params: Joi.object().keys({
		userId: Joi.custom(objectId).required(),
	}),
};

export const updateUser = {
	params: Joi.object().keys({
		userId: Joi.required().custom(objectId),
	}),
	body: Joi.object()
		.keys({
			email: Joi.string().email(),
			password: Joi.string().custom(password),
			name: Joi.string(),
			technologies: Joi.string().custom(objectId),
			role: Joi.string().valid(...Object.values(ROLES)),
		})
		.min(1),
};

export const updateAdminUserMe = {
	body: Joi.object()
		.keys({
			email: Joi.string().email(),
			password: Joi.string().custom(password),
			name: Joi.string(),
			technologies: Joi.string().custom(objectId),
			role: Joi.string().valid(...Object.values(ROLES)),
		})
		.min(1),
};

export const deleteUser = {
	params: Joi.object().keys({
		userId: Joi.string().custom(objectId),
	}),
};

export default {
	createUser,
	getUsers,
	getUser,
	updateUser,
	updateAdminUserMe,
	deleteUser,
};
