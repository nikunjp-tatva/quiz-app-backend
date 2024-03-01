import passport from 'passport';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

import ApiError from '../utils/ApiError';
import logger from '../utils/logger';

interface RequestWithUser extends Request {
	user: any;
	params: any;
}

const verifyCallback =
	(
		req: RequestWithUser,
		resolve: { (value: unknown): void; (): void },
		reject: { (reason?: string): void; (arg0: ApiError): any },
	) =>
	async (err: any, user: { role: string }, info: any) => {
		if (err?.stack.includes('MongooseServerSelectionError')) {
			logger.error(err);
			return reject(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error'));
		}
		if (err || info || !user) {
			return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
		}
		req.user = user;

		if (req.user.role !== 'ADMIN') {
			return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
		}

		resolve();
	};

const isAdmin = (): any => async (req: RequestWithUser, res: Response, next: NextFunction) =>
	new Promise((resolve, reject) => {
		passport.authenticate(
			'jwt',
			{ session: false },
			verifyCallback(req, () => resolve('success'), reject),
		)(req, res, next);
	})
		.then(() => next())
		.catch((err) => next(err));

export default isAdmin;
