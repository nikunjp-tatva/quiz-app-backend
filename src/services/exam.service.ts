import { ExamResult } from '../models';

/**
 * Add a exam response
 * @param {Object} examResponseBody
 */
export const addExamResponse = async (examResponseBody) => ExamResult.create(examResponseBody);

/**
 * Query for Exam Results
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
export const queryExamResponse = async (filter, options) => ExamResult.paginate(filter, options);

/**
 * Get Exam Result by userId
 * @param {string} userId
 * @returns {Promise<ExamResult>}
 */
export const getExamResultsByUserId = async (userId: string) =>
	ExamResult.findOne({ user: userId }).populate('technology');

export default {
	addExamResponse,
	queryExamResponse,
	getExamResultsByUserId,
};
