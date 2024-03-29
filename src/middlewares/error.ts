import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

import config from '../config/config';
import logger from '../utils/logger';
import ApiError from '../utils/ApiError';

interface ErrorWithStatusCode extends Error {
	statusCode: number;
}

export const errorConverter = (
	err: ErrorWithStatusCode,
	_req: Request,
	_res: Response,
	next: NextFunction,
) => {
	let error = err;
	if (!(error instanceof ApiError)) {
		const statusCode =
			error.statusCode || error instanceof mongoose.Error
				? httpStatus.BAD_REQUEST
				: httpStatus.INTERNAL_SERVER_ERROR;
		const message = error.message || httpStatus[statusCode];
		error = new ApiError(statusCode, message, false, err.stack);
	}
	next(error);
};

export const errorHandler = (
	err: { isOperational?: boolean; message: string; stack?: any; statusCode?: number },
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	let { statusCode, message } = err;
	if (config.env === 'production' && !err.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}

	res.locals.errorMessage = err.message;

	const response = {
		status: 'error',
		code: statusCode,
		message,
		...(config.env === 'development' && { stack: err.stack }),
	};

	if (config.env === 'development') {
		logger.error(err);
	}

	res.status(statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).send(response);
};

export default {
	errorConverter,
	errorHandler,
};
