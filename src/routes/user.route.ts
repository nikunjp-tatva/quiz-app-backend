import express from 'express';
import validate from '../middlewares/validate';
import userValidation from '../validations/user.validation';
import userController from '../controllers/user.controller';
import auth from '../middlewares/auth';

const router = express.Router();

router
	.route('/me')
	.get(auth, userController.getUserMe)
	.patch(auth, validate(userValidation.updateUserMe), userController.updateUserMe);

export default router;
