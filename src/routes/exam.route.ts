import express from 'express';

import validate from '../middlewares/validate';
import auth from '../middlewares/auth';
import examValidation from '../validations/exam.validation';
import examController from '../controllers/exam.controller';
import hasExamAccess from '../middlewares/hasExamAccess';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

router
	.route('/result')
	.post(auth, hasExamAccess, validate(examValidation.examResult), examController.examResult);

router.route('/list').get(auth, hasExamAccess, examController.givenExamLists);

router.route('/summary').get(auth, isAdmin, hasExamAccess, examController.allExamSummary);

router
	.route('/details/:technologyId')
	.get(
		auth,
		hasExamAccess,
		validate(examValidation.getExamDetails),
		examController.getExamDetails,
	);

export default router;
