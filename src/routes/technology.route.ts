import express from 'express';

import validate from '../middlewares/validate';
import auth from '../middlewares/auth';
import isAdmin from '../middlewares/isAdmin';
import technologyValidation from '../validations/technology.validation';
import technologyController from '../controllers/technology.controller';

const router = express.Router();

router
	.route('/')
	.post(
		auth,
		isAdmin,
		validate(technologyValidation.addTechnology),
		technologyController.addTechnology,
	)
	.get(
		auth,
		isAdmin,
		validate(technologyValidation.getTechnologies),
		technologyController.getTechnologies,
	);

router
	.route('/:technologyId')
	.get(auth, validate(technologyValidation.getTechnology), technologyController.getTechnology)
	.patch(
		auth,
		isAdmin,
		validate(technologyValidation.updateTechnology),
		technologyController.updateTechnology,
	)
	.delete(
		auth,
		isAdmin,
		validate(technologyValidation.deleteTechnology),
		technologyController.deleteTechnology,
	);

export default router;
