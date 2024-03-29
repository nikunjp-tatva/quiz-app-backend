import mongoose, { Model, Schema } from 'mongoose';
import { EXAM_STATUS } from '../config/constant';
import { toJSON, paginate } from './plugins';

interface IExamResult extends mongoose.Document {
	user: Schema.Types.ObjectId;
	technology: Schema.Types.ObjectId;
	dateAppeared: Date;
	status: Array<keyof typeof EXAM_STATUS> | null;
	score: number;
	responses: object[];
	duration: number;
	completeTime: number;
}

interface ExamResultModel extends Model<IExamResult> {
	paginate(filter: any, option: any): any;
}

const examResultSchema = new Schema<IExamResult, ExamResultModel>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		technology: {
			type: Schema.Types.ObjectId,
			ref: 'Technology',
			required: true,
		},
		responses: [
			{
				questionId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Question',
					required: true,
				},
				selectedOption: {
					type: String,
					default: null,
				},
				isCorrect: {
					type: Boolean,
					default: false,
				},
				isSkipped: {
					type: Boolean,
					default: true,
				},
			},
		],
		duration: {
			type: mongoose.Schema.Types.Number,
		},
		completeTime: {
			type: mongoose.Schema.Types.Number,
		},
		score: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: EXAM_STATUS,
			default: null,
		},
		dateAppeared: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

// add plugin that converts mongoose to json
examResultSchema.plugin(toJSON);
examResultSchema.plugin(paginate);

/**
 * @typedef ExamResult
 */
export const ExamResult = mongoose.model<IExamResult, ExamResultModel>(
	'ExamResult',
	examResultSchema,
);

export default ExamResult;
