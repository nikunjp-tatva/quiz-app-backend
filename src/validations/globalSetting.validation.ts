import Joi from 'joi';

export const addGlobalSettings = {
	body: Joi.object().keys({
		noOfQuestion: Joi.number().integer().required(),
		duration: Joi.number().integer().required(),
		cutOff: Joi.number().integer().required(),
	}),
};

export const updateGlobalSettings = {
	body: Joi.object()
		.keys({
			noOfQuestion: Joi.number().integer(),
			duration: Joi.number().integer(),
			cutOff: Joi.number().integer(),
		})
		.min(1),
};

export default {
	addGlobalSettings,
	updateGlobalSettings,
};
