import express from 'express';

import adminRoute from './admin.route';
import authRoute from './auth.route';
import globalSettingRoute from './globalSetting.route';
import questionRoute from './question.route';
import technologyRoute from './technology.route';
import userRoute from './user.route';

const router = express.Router();

const defaultRoutes = [
	{
		path: '/admin',
		route: adminRoute,
	},
	{
		path: '/auth',
		route: authRoute,
	},
	{
		path: '/globalSettings',
		route: globalSettingRoute,
	},
	{
		path: '/questions',
		route: questionRoute,
	},
	{
		path: '/technologies',
		route: technologyRoute,
	},
	{
		path: '/users',
		route: userRoute,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
