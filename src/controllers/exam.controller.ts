import httpStatus from 'http-status';
import { Request, Response } from 'express';

import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { questionService, technologyService } from '../services';

const getExamDetails = catchAsync(async (req: Request, res: Response) => {
	const technology = await technologyService.getTechnologyById(req.params.technologyId);
	if (!technology) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Exam not found');
	}
	const questions = await questionService.getQuestionsByTechnologyId(technology.id);
	res.send({ technology, questions });
});

export default {
	getExamDetails,
};
