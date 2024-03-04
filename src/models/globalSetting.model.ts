import mongoose from 'mongoose';
import { toJSON } from './plugins';

interface IGlobalSetting extends mongoose.Document {
	noOfQuestion: number;
	duration: number;
	cutOff: number;
}

const globalSettingSchema = new mongoose.Schema<IGlobalSetting>(
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

/**
 * @typedef GlobalSetting
 */
export const GlobalSetting = mongoose.model<IGlobalSetting>('Global-Setting', globalSettingSchema);

export default GlobalSetting;
