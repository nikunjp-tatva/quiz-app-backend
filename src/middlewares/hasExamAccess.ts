import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';

import ApiError from '../utils/ApiError';
import { ROLES } from '../config/constant';
import { IUser } from '../models/user.model';

const hasExamAccess = async (req: Request, _res: Response, next: NextFunction): Promise<any> => {
	try {
		const technologyId = req.params.technologyId as unknown as ObjectId;
		if (
			(req.user as IUser).role !== ROLES.ADMIN &&
			!(req.user as IUser).technologies.includes(technologyId)
		) {
			throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
		}
		next();
	} catch (err) {
		next(err);
	}
};

export default hasExamAccess;
