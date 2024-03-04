import httpStatus from 'http-status';

import { Question } from '../models';
import ApiError from '../utils/ApiError';

/**
 * Add a question
 * @param {Object} questionBody
 * @returns {Promise<Question>}
 */
export const addQuestion = async (questionBody) => {
	if (await Question.isQuestionExists(questionBody)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Question already exists or soft deleted');
	}
	return Question.create(questionBody);
};

/**
 * Query for question
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
export const queryQuestion = async (filter, options) => Question.paginate(filter, options);

/**
 * Get question by id
 * @param {ObjectId} id
 * @returns {Promise<Question>}
 */
export const getQuestionById = async (id) =>
	Question.findOne({ _id: id, isDeleted: false }).populate('technology');

/**
 * Update question by id
 * @param {ObjectId} questionId
 * @param {Object} updateBody
 * @returns {Promise<Question>}
 */
export const updateQuestionById = async (questionId: string, updateBody: object) => {
	const question = await getQuestionById(questionId);
	if (!question) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
	}
	if (
		updateBody &&
		(await Question.isQuestionExists({ ...question, ...updateBody }, questionId))
	) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Question already exists or soft deleted');
	}
	Object.assign(question, updateBody);
	await question.save();
	return question;
};

/**
 * Soft delete question by id
 * @param {ObjectId} questionId
 * @returns {Promise<Question>}
 */
export const softDeleteQuestionById = async (questionId) => {
	const question = await getQuestionById(questionId);
	if (!question) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
	}
	// Set the deletedAt field to the current date and time
	await question.softDelete();
	return question;
};

/**
 * Delete question by id
 * @param {ObjectId} questionId
 * @returns {Promise<Question>}
 */
export const deleteQuestionById = async (questionId) => {
	const question = await getQuestionById(questionId);
	if (!question) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
	}
	await question.deleteOne();
	return question;
};

export default {
	addQuestion,
	queryQuestion,
	getQuestionById,
	updateQuestionById,
	softDeleteQuestionById,
	deleteQuestionById,
};
