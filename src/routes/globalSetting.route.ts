import express from 'express';

import validate from '../middlewares/validate';
import auth from '../middlewares/auth';
import isAdmin from '../middlewares/isAdmin';
import globalSettingValidation from '../validations/globalSetting.validation';
import globalSettingController from '../controllers/globalSetting.controller';

const router = express.Router();

router
	.route('/')
	.post(
		auth,
		isAdmin,
		validate(globalSettingValidation.addGlobalSettings),
		globalSettingController.addGlobalSettings,
	)
	.get(auth, isAdmin, globalSettingController.getGlobalSettings)
	.patch(
		auth,
		isAdmin,
		validate(globalSettingValidation.updateGlobalSettings),
		globalSettingController.updateGlobalSettings,
	);

export default router;
