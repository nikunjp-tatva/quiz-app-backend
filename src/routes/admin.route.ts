import express from 'express';
import validate from '../middlewares/validate';
import adminValidation from '../validations/admin.validation';
import userController from '../controllers/user.controller';
import isAdmin from '../middlewares/isAdmin';
import auth from '../middlewares/auth';

const router = express.Router();

router
	.route('/users')
	.post(auth, isAdmin, validate(adminValidation.createUser), userController.createUser)
	.get(auth, isAdmin, validate(adminValidation.getUsers), userController.getUsers);

router
	.route('/users/:userId')
	.get(auth, isAdmin, validate(adminValidation.getUser), userController.getUser)
	.patch(auth, isAdmin, validate(adminValidation.updateUser), userController.updateUser)
	.delete(auth, isAdmin, validate(adminValidation.deleteUser), userController.deleteUser);

router
	.route('/me')
	.get(auth, isAdmin, userController.getUserMe)
	.patch(auth, isAdmin, validate(adminValidation.updateAdminUserMe), userController.updateUserMe);

export default router;
