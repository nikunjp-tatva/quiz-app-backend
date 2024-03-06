/* eslint-disable no-param-reassign */
import httpStatus from 'http-status';
import { Request, Response } from 'express';

import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { questionService, technologyService, examService, globalSettings } from '../services';
import { IUser } from '../models';
import { EXAM_STATUS } from '../config/constant';
import pick from '../utils/pick';

const getExamDetails = catchAsync(async (req: Request, res: Response) => {
	const technology = await technologyService.getTechnologyById(req.params.technologyId);
	if (!technology) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Exam not found');
	}
	const questions = await questionService.getQuestionsByTechnologyId(technology.id);
	const globalSetting = await globalSettings.getGlobalSettings();

	technology.duration = technology?.duration ? technology?.duration : globalSetting?.duration;
	technology.cutOff = technology?.cutOff ? technology?.cutOff : globalSetting?.cutOff;
	technology.noOfQuestion = technology?.noOfQuestion
		? technology?.noOfQuestion
		: globalSetting?.noOfQuestion;

	res.send({ technology, questions });
});

const examResult = catchAsync(async (req: Request, res: Response) => {
	const { technologyId, submittedQuestions, completeTime } = req.body;
	const technology = await technologyService.getTechnologyById(technologyId);
	if (!technology) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Exam not found');
	}

	const globalSetting = await globalSettings.getGlobalSettings();

	const questionsFromDatabase = (
		await questionService.getQuestionsByTechnologyIdWithAnswers(technology.id)
	).reduce((accumulator, question) => {
		accumulator[question.id] = question;
		return accumulator;
	}, {});

	let noOfCorrectQuestions = 0;
	const skippedQuestions: unknown[] = [];

	const updatedQuestions = submittedQuestions.map((questionDetails) => {
		questionDetails.questionId = questionDetails.id;
		if (questionDetails?.selectedOption) {
			const isCorrect =
				questionDetails.selectedOption ===
				questionsFromDatabase[questionDetails.id].correctOption;
			if (isCorrect) {
				noOfCorrectQuestions += 1;
			}

			questionDetails.isCorrect = isCorrect;
			questionDetails.isSkipped = false;
		} else {
			skippedQuestions.push({
				questionText: questionsFromDatabase[questionDetails.id].questionText,
				questionId: questionDetails.id,
				options: questionsFromDatabase[questionDetails.id].options,
				selectedOption: questionDetails.selectedOption,
			});
		}

		return questionDetails;
	});

	technology.duration = technology?.duration ? technology?.duration : globalSetting.duration;
	technology.cutOff = technology?.cutOff ? technology?.cutOff : globalSetting.cutOff;
	technology.noOfQuestion = technology?.noOfQuestion
		? technology?.noOfQuestion
		: globalSetting.noOfQuestion;

	const status =
		noOfCorrectQuestions - technology.cutOff > 0 ? EXAM_STATUS.PASS : EXAM_STATUS.FAIL;

	await examService.addExamResponse({
		user: (req?.user as IUser)?.id,
		technology: technology.id,
		responses: updatedQuestions,
		duration: technology.duration,
		completeTime,
		score: noOfCorrectQuestions,
		status,
		dateAppeared: new Date(),
	});
	res.send({
		technology,
		percentage: (noOfCorrectQuestions / technology.noOfQuestion) * 100,
		status,
		skippedQuestions,
		noOfCorrectQuestions,
	});
});

const givenExamLists = catchAsync(async (req: Request, res: Response) => {
	const filter = pick(req.query, ['technology', 'status']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	options.populate = 'technology';
	filter.user = (req.user as IUser).id;
	const result = await examService.queryExamResponse(filter, options);
	res.send(result);
});

const allExamSummary = catchAsync(async (req: Request, res: Response) => {
	const filter = pick(req.query, ['technology', 'status', 'user']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	options.populate = 'technology,user';
	const result = await examService.queryExamResponse(filter, options);
	res.send(result);
});

export default {
	getExamDetails,
	examResult,
	givenExamLists,
	allExamSummary,
};
