import passport from 'passport';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';
import logger from '../utils/logger';

interface RequestWithUser extends Request {
	user: any;
	params: any;
}

const verifyCallback =
	(
		req: RequestWithUser,
		resolve: { (value: unknown): void; (): void },
		reject: { (reason?: any): void; (arg0: ApiError): any },
		requiredRights: any[] = [],
	) =>
	async (err: any, user: { role: string; id: any }, info: any) => {
		if (err?.stack.includes('MongooseServerSelectionError')) {
			logger.error(err);
			return reject(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error'));
		}
		if (err || info || !user) {
			return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
		}
		req.user = user;

		if (requiredRights.length) {
			const userRights = roleRights.get(user.role);
			const hasRequiredRights = requiredRights.every((requiredRight: any) =>
				userRights?.includes(requiredRight as never),
			);
			if (!hasRequiredRights && req.params.userId !== user.id) {
				return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
			}
		}

		resolve();
	};

const auth =
	(...requiredRights: any[]): any =>
	async (req: RequestWithUser, res: Response, next: NextFunction) =>
		new Promise((resolve, reject) => {
			passport.authenticate(
				'jwt',
				{ session: false },
				verifyCallback(req, () => resolve('success'), reject, requiredRights),
			)(req, res, next);
		})
			.then(() => next())
			.catch((err) => next(err));

export default auth;
