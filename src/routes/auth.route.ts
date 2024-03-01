import express from 'express';
import validate from '../middlewares/validate';
import authValidation from '../validations/auth.validation';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post(
	'/refresh-tokens',
	validate(authValidation.refreshTokens),
	authController.refreshTokens,
);
router.post(
	'/forgot-password',
	validate(authValidation.forgotPassword),
	authController.forgotPassword,
);
router.post(
	'/reset-password',
	validate(authValidation.resetPassword),
	authController.resetPassword,
);

export default router;
