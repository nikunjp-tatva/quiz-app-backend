import express from 'express';

import validate from '../middlewares/validate';
import auth from '../middlewares/auth';
import isAdmin from '../middlewares/isAdmin';
import questionValidation from '../validations/question.validation';
import questionController from '../controllers/question.controller';

const router = express.Router();

router
	.route('/')
	.post(auth, isAdmin, validate(questionValidation.addQuestion), questionController.addQuestion)
	.get(auth, isAdmin, validate(questionValidation.getQuestions), questionController.getQuestions);

router
	.route('/:questionId')
	.get(auth, validate(questionValidation.getQuestion), questionController.getQuestion)
	.patch(
		auth,
		isAdmin,
		validate(questionValidation.updateQuestion),
		questionController.updateQuestion,
	)
	.delete(
		auth,
		isAdmin,
		validate(questionValidation.deleteQuestion),
		questionController.deleteQuestion,
	);

export default router;
