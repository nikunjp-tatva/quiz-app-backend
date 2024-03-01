import mongoose, { Model, Types, Schema } from 'mongoose';
import { toJSON, paginate } from './plugins';

interface IQuestion {
	technology: Types.ObjectId;
	questionText: string;
	description: string;
	options: string;
	correctOption: string;
	isDeleted: boolean;
}

interface QuestionModel extends Model<IQuestion> {
	paginate(filter: any, option: any): any;
}

const questionSchema = new Schema<IQuestion, QuestionModel>(
	{
		technology: {
			type: Schema.Types.ObjectId,
			ref: 'Technology',
			required: true,
		},
		questionText: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		options: [
			{
				type: String,
			},
		],
		correctOption: {
			type: String,
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// add plugin that converts mongoose to json
questionSchema.plugin(toJSON);
questionSchema.plugin(paginate);

/**
 * @typedef Question
 */
export const Question = mongoose.model<IQuestion, QuestionModel>('Question', questionSchema);

export default Question;
