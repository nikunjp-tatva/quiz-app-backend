import mongoose, { Model } from 'mongoose';
import { toJSON, paginate } from './plugins';

interface IGlobalSetting {
	name: string;
	description: string;
	logo: string;
	noOfQuestion: number;
	duration: number;
	cutOff: number;
	global: boolean;
}

interface GlobalSettingModel extends Model<IGlobalSetting> {
	paginate(filter: any, option: any): any;
}

const globalSettingSchema = new mongoose.Schema<IGlobalSetting, GlobalSettingModel>(
	{
		noOfQuestion: {
			type: Number,
			trim: true,
			required: true,
		},
		duration: {
			type: Number,
			trim: true,
			required: true,
		},
		cutOff: {
			type: Number,
			trim: true,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// add plugin that converts mongoose to json
globalSettingSchema.plugin(toJSON);
globalSettingSchema.plugin(paginate);

/**
 * @typedef GlobalSetting
 */
export const GlobalSetting = mongoose.model<IGlobalSetting, GlobalSettingModel>(
	'GlobalSetting',
	globalSettingSchema,
);

export default GlobalSetting;
