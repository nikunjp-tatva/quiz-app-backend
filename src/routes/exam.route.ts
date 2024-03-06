import express from 'express';

import validate from '../middlewares/validate';
import auth from '../middlewares/auth';
import examValidation from '../validations/exam.validation';
import examController from '../controllers/exam.controller';
import hasExamAccess from '../middlewares/hasExamAccess';

const router = express.Router();

router
	.route('/details/:technologyId')
	.get(
		auth,
		hasExamAccess,
		validate(examValidation.getExamDetails),
		examController.getExamDetails,
	);

export default router;
