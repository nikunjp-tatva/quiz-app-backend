import mongoose, { Model, ObjectId } from 'mongoose';

import { toJSON, paginate } from './plugins';

type numberSettingType = number | undefined | null;

export interface ITechnology extends mongoose.Document {
	name: string;
	description: string;
	logoUrl: string;
	noOfQuestion: numberSettingType;
	duration: numberSettingType;
	cutOff: numberSettingType;
}

interface TechnologyModel extends Model<ITechnology> {
	paginate(filter: 'name', option: 'sortBy' | 'limit' | 'page'): any;
	isNameExists(name: string, excludeTechnologyId?: string): boolean;
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
		logoUrl: {
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
	},
	{
		timestamps: true,
	},
);

// add plugin that converts mongoose to json
technologySchema.plugin(toJSON);
technologySchema.plugin(paginate);

/**
 * Check if name is taken
 * @param {string} name - The technology name
 * @param {ObjectId} [excludeUserId] - The id of the technology to be excluded
 * @returns {Promise<boolean>}
 */
technologySchema.statics.isNameExists = async function (
	name: string,
	excludeTechnologyId: ObjectId,
): Promise<boolean> {
	const technology = await this.findOne({ name, _id: { $ne: excludeTechnologyId } });
	return !!technology;
};

/**
 * @typedef Technology
 */
export const Technology = mongoose.model<ITechnology, TechnologyModel>(
	'Technology',
	technologySchema,
);

export default Technology;
