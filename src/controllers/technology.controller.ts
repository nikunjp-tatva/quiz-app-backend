import httpStatus from 'http-status';
import { Request, Response } from 'express';

import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { questionService, technologyService } from '../services';

const addTechnology = catchAsync(async (req: Request, res: Response) => {
	const technology = await technologyService.addTechnology(req.body);
	res.status(httpStatus.CREATED).send(technology);
});

const getTechnologies = catchAsync(async (req: Request, res: Response) => {
	const filter = pick(req.query, ['name']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const result = await technologyService.queryTechnology(filter, options);
	res.send(result);
});

const getTechnology = catchAsync(async (req: Request, res: Response) => {
	const technology = await technologyService.getTechnologyById(req.params.technologyId);
	if (!technology) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Technology not found');
	}
	res.send(technology);
});

const updateTechnology = catchAsync(async (req: Request, res: Response) => {
	const technology = await technologyService.updateTechnologyById(
		req.params.technologyId,
		req.body,
	);
	res.send(technology);
});

const deleteTechnology = catchAsync(async (req: Request, res: Response) => {
	await technologyService.deleteTechnologyById(req.params.technologyId);
	res.status(httpStatus.NO_CONTENT).send();
});

const getTechnologyDetails = catchAsync(async (req: Request, res: Response) => {
	const technology = await technologyService.getTechnologyById(req.params.technologyId);
	if (!technology) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Technology not found');
	}
	const questions = await questionService.getQuestionsByTechnologyId(technology.id);
	res.send({ technology, questions });
});

export default {
	addTechnology,
	getTechnologies,
	getTechnology,
	updateTechnology,
	deleteTechnology,
	getTechnologyDetails,
};
