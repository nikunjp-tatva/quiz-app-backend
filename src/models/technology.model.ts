import mongoose, { Model } from 'mongoose';
import { toJSON, paginate } from './plugins';

interface ITechnology {
	name: string;
	description: string;
	logo: string;
	noOfQuestion: number;
	duration: number;
	cutOff: number;
	useGlobalSetting: boolean;
}

interface TechnologyModel extends Model<ITechnology> {
	paginate(filter: any, option: any): any;
}

const technologySchema = new mongoose.Schema<ITechnology, TechnologyModel>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		description: {
			type: String,
			trim: true,
			default: null,
		},
		logo: {
			type: String,
			required: true,
			trim: true,
		},
		noOfQuestion: {
			type: Number,
			trim: true,
			default: null,
		},
		duration: {
			type: Number,
			trim: true,
			default: null,
		},
		cutOff: {
			type: Number,
			trim: true,
			default: null,
		},
		useGlobalSetting: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// add plugin that converts mongoose to json
technologySchema.plugin(toJSON);
technologySchema.plugin(paginate);

/**
 * @typedef Technology
 */
export const Technology = mongoose.model<ITechnology, TechnologyModel>(
	'Technology',
	technologySchema,
);

export default Technology;
