import Joi from 'joi';
import { password } from './custom.validation';

export const updateUserMe = {
	body: Joi.object()
		.keys({
			email: Joi.string().email(),
			password: Joi.string().custom(password),
			name: Joi.string(),
		})
		.min(1),
};

export default {
	updateUserMe,
};
