import Joi from 'joi';

import { objectId } from './custom.validation';

export const addTechnology = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		logoUrl: Joi.string().required(),
		description: Joi.string(),
		noOfQuestion: Joi.number().integer(),
		duration: Joi.number().integer(),
		cutOff: Joi.number().integer(),
		useGlobalSetting: Joi.boolean(),
	}),
};

export const getTechnologies = {
	query: Joi.object().keys({
		name: Joi.string(),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

export const getTechnology = {
	params: Joi.object().keys({
		technologyId: Joi.custom(objectId).required(),
	}),
};

export const updateTechnology = {
	params: Joi.object().keys({
		technologyId: Joi.required().custom(objectId),
	}),
	body: Joi.object()
		.keys({
			name: Joi.string(),
			logoUrl: Joi.string(),
			description: Joi.string(),
			noOfQuestion: Joi.number().integer(),
			duration: Joi.number().integer(),
			cutOff: Joi.number().integer(),
			useGlobalSetting: Joi.boolean(),
		})
		.min(1),
};

export const deleteTechnology = {
	params: Joi.object().keys({
		technologyId: Joi.string().custom(objectId),
	}),
};

export default {
	addTechnology,
	getTechnologies,
	getTechnology,
	updateTechnology,
	deleteTechnology,
};
