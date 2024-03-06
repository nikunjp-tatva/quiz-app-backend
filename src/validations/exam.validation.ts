import Joi from 'joi';

import { objectId } from './custom.validation';

export const getExamDetails = {
	params: Joi.object().keys({
		technologyId: Joi.custom(objectId).required(),
	}),
};

export const examResult = {
	body: Joi.object().keys({
		submittedQuestions: Joi.array()
			.items(
				Joi.object({
					id: Joi.string().custom(objectId).required(),
					selectedOption: Joi.string(),
				}),
			)
			.required(),
		technologyId: Joi.string().custom(objectId).required(),
		completeTime: Joi.number().required(),
		examSubmittedAt: Joi.date(),
	}),
};

export default {
	getExamDetails,
	examResult,
};
