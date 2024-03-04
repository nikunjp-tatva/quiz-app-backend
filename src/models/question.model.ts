import mongoose, { Model, Schema, ObjectId, Document, PopulatedDoc } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { ITechnology } from './technology.model';

interface IQuestion extends mongoose.Document {
	technology: PopulatedDoc<Document<ITechnology> & ITechnology>;
	questionText: string;
	description: string;
	options: string[];
	correctOption: string;
	isDeleted: boolean;
}

interface QuestionModel extends Model<IQuestion> {
	paginate(filter: ['questionText', 'technology'], option: ['sortBy', 'limit', 'page']): any;
	isQuestionExists(questionData, questionId?: string): boolean;
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
 * Check if question is exists
 * @param {Object} questionData - The question data
 * @param {string} questionData.questionText - The text of the question.
 * @param {string} questionData.correctOption - The correct option of the question.
 * @param {string} questionData.technology - The technology of the question.
 * @param {Array} questionData.options - The option array of the question.
 * @param {ObjectId} [excludeQuestionId] - The id of the question to be excluded
 * @returns {Promise<boolean>}
 */
questionSchema.statics.isQuestionExists = async function (
	questionData: {
		questionText: string;
		correctOption: string;
		technology: string;
		options: string[];
	},
	excludeQuestionId: ObjectId,
): Promise<boolean> {
	const question = await this.findOne({
		questionText: questionData.questionText,
		correctOption: questionData.correctOption,
		_id: { $ne: excludeQuestionId },
	}).populate('technology');

	if (question?.technology?.name === questionData?.technology) {
		const isSame =
			question?.options?.length === questionData?.options?.length &&
			question?.options.every((element, index) => element === questionData?.options[index]);
		return isSame;
	}

	return !!question;
};

/**
 * @typedef Question
 */
export const Question = mongoose.model<IQuestion, QuestionModel>('Question', questionSchema);

export default Question;
