import Joi from 'joi';

import { objectId } from './custom.validation';

export const getExamDetails = {
	params: Joi.object().keys({
		technologyId: Joi.custom(objectId).required(),
	}),
};

export default {
	getExamDetails,
};
