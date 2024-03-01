import passport from 'passport';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

import ApiError from '../utils/ApiError';
import logger from '../utils/logger';

const verifyCallback =
	(
		req: Request,
		resolve: { (value: unknown): void; (): void },
		reject: { (reason?: string): void; (arg0: ApiError): any },
	) =>
	async (err: any, user: { role: string }, info: Error) => {
		if (err?.stack.includes('MongooseServerSelectionError')) {
			logger.error(err);
			return reject(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error'));
		}
		if (err || info || !user) {
			logger.error(info);
			return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
		}
		req.user = user;
		resolve();
	};

const auth = async (req: Request, res: Response, next: NextFunction) =>
	new Promise((resolve, reject) => {
		passport.authenticate(
			'jwt',
			{ session: false },
			verifyCallback(req, () => resolve('success'), reject),
		)(req, res, next);
	})
		.then(() => next())
		.catch((err) => next(err));

export default auth;
