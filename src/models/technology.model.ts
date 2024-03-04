import mongoose, { Model, ObjectId } from 'mongoose';

import { toJSON, paginate } from './plugins';

interface ITechnology extends mongoose.Document {
	name: string;
	description: string;
	logoUrl: string;
	noOfQuestion: number;
	duration: number;
	cutOff: number;
	useGlobalSetting: boolean;
}

interface TechnologyModel extends Model<ITechnology> {
	paginate(filter: 'name', option: 'sortBy' | 'limit' | 'page'): any;
	isNameExists(name: string, userId?: string): boolean;
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
 * Check if name is taken
 * @param {string} name - The technology name
 * @param {ObjectId} [excludeUserId] - The id of the technology to be excluded
 * @returns {Promise<boolean>}
 */
technologySchema.statics.isNameExists = async function (
	name: string,
	excludeUserId: ObjectId,
): Promise<boolean> {
	const technology = await this.findOne({ name, _id: { $ne: excludeUserId } });
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
