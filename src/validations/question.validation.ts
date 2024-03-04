import Joi from 'joi';

import { objectId } from './custom.validation';

export const addQuestion = {
	body: Joi.object().keys({
		technology: Joi.custom(objectId).required(),
		questionText: Joi.string().required(),
		description: Joi.string(),
		options: Joi.array().items(Joi.string().required()).min(1).required(),
		correctOption: Joi.string()
			.custom((value, helpers) => {
				const { options } = helpers.state.ancestors[0];
				if (!options.includes(value)) {
					return helpers.error('any.invalid');
				}
				return value;
			}, 'Options Validation')
			.required(),
	}),
};

export const getQuestions = {
	query: Joi.object().keys({
		questionText: Joi.string(),
		technology: Joi.string(),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

export const getQuestion = {
	params: Joi.object().keys({
		questionId: Joi.custom(objectId).required(),
	}),
};

export const updateQuestion = {
	params: Joi.object().keys({
		questionId: Joi.required().custom(objectId),
	}),
	body: Joi.object()
		.keys({
			technology: Joi.custom(objectId),
			questionText: Joi.string(),
			description: Joi.string(),
			options: Joi.array().items(Joi.string().required()).min(1),
			correctOption: Joi.string(),
			isDeleted: Joi.boolean(),
		})
		.min(1),
};

export const deleteQuestion = {
	params: Joi.object().keys({
		questionId: Joi.string().custom(objectId),
	}),
};

export default {
	addQuestion,
	getQuestions,
	getQuestion,
	updateQuestion,
	deleteQuestion,
};
