import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

import ApiError from '../utils/ApiError';
import { ROLES } from '../config/constant';
import { IUser } from '../models/user.model';

const isAdmin = async (req: Request, _res: Response, next: NextFunction): Promise<any> => {
	try {
		if ((req.user as IUser).role !== ROLES.ADMIN) {
			throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
		}
		next();
	} catch (err) {
		next(err);
	}
};

export default isAdmin;
