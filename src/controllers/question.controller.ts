import httpStatus from 'http-status';
import { Request, Response } from 'express';

import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { questionService } from '../services';

const addQuestion = catchAsync(async (req: Request, res: Response) => {
	const question = await questionService.addQuestion(req.body);
	res.status(httpStatus.CREATED).send(question);
});

const getQuestions = catchAsync(async (req: Request, res: Response) => {
	const filter = pick(req.query, ['questionText', 'technology']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	options.populate = 'technology';
	const result = await questionService.queryQuestion(filter, options);
	res.send(result);
});

const getQuestion = catchAsync(async (req: Request, res: Response) => {
	const question = await questionService.getQuestionById(req.params.questionId);
	if (!question) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
	}
	res.send(question);
});

const updateQuestion = catchAsync(async (req: Request, res: Response) => {
	const question = await questionService.updateQuestionById(req.params.questionId, req.body);
	res.send(question);
});

const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
	await questionService.deleteQuestionById(req.params.questionId);
	res.status(httpStatus.NO_CONTENT).send();
});

export default {
	addQuestion,
	getQuestions,
	getQuestion,
	updateQuestion,
	deleteQuestion,
};
