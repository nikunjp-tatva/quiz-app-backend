import express from 'express';
import validate from '../../middlewares/validate';
import userValidation from '../../validations/user.validation';
import userController from '../../controllers/user.controller';
import isAdmin from '../../middlewares/isAdmin';

const router = express.Router();

router
	.route('/')
	.post(isAdmin, validate(userValidation.createUser), userController.createUser)
	.get(isAdmin, validate(userValidation.getUsers), userController.getUsers);

router
	.route('/:userId')
	.get(isAdmin, validate(userValidation.getUser), userController.getUser)
	.patch(isAdmin, validate(userValidation.updateUser), userController.updateUser)
	.delete(isAdmin, validate(userValidation.deleteUser), userController.deleteUser);

export default router;
