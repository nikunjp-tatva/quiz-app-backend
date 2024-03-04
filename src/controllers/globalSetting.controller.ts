import httpStatus from 'http-status';
import { Request, Response } from 'express';

import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { globalSettings } from '../services';

const addGlobalSettings = catchAsync(async (req: Request, res: Response) => {
	const settings = await globalSettings.addGlobalSettings(req.body);
	res.status(httpStatus.CREATED).send(settings);
});

const getGlobalSettings = catchAsync(async (_req: Request, res: Response) => {
	const settings = await globalSettings.getGlobalSettings();
	if (!settings) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Global Settings not found');
	}
	res.send(settings);
});

const updateGlobalSettings = catchAsync(async (req: Request, res: Response) => {
	const settings = await globalSettings.updateGlobalSettings(req.body);
	res.send(settings);
});

export default {
	addGlobalSettings,
	getGlobalSettings,
	updateGlobalSettings,
};
