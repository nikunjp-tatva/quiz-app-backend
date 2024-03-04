import httpStatus from 'http-status';

import { GlobalSetting } from '../models';
import ApiError from '../utils/ApiError';

/**
 * Add a global setting
 * @param {Object} configBody
 * @returns {Promise<GlobalSetting>}
 */
export const addGlobalSettings = async (configBody) => {
	if ((await GlobalSetting.find()).length === 1) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Global settings already exists');
	}
	return GlobalSetting.create(configBody);
};

/**
 * Get global setting data
 * @returns {Promise<GlobalSetting>}
 */
export const getGlobalSettings = async () => GlobalSetting.findOne();

/**
 * Update global setting data
 * @param {Object} updateBody
 * @returns {Promise<GlobalSetting>}
 */
export const updateGlobalSettings = async (updateBody: object) => {
	const globalSetting = await getGlobalSettings();
	if (!globalSetting) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Global settings not found');
	}
	Object.assign(globalSetting, updateBody);
	await globalSetting.save();
	return globalSetting;
};

export default {
	addGlobalSettings,
	getGlobalSettings,
	updateGlobalSettings,
};
