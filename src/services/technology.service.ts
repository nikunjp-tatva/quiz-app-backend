import httpStatus from 'http-status';

import { Technology } from '../models';
import ApiError from '../utils/ApiError';

/**
 * Add a technology
 * @param {Object} technologyBody
 * @returns {Promise<Technology>}
 */
export const addTechnology = async (technologyBody) => {
	if (await Technology.isNameExists(technologyBody.name)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
	}
	return Technology.create(technologyBody);
};

/**
 * Query for technology
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
export const queryTechnology = async (filter, options) => Technology.paginate(filter, options);

/**
 * Get technology by id
 * @param {ObjectId} id
 * @returns {Promise<Technology>}
 */
export const getTechnologyById = async (id) => Technology.findById(id);

/**
 * Get technology by name
 * @param {string} name
 * @returns {Promise<Technology>}
 */
export const getTechnologyByName = async (name) => Technology.findOne({ name });

/**
 * Update technology by id
 * @param {ObjectId} technologyId
 * @param {Object} updateBody
 * @returns {Promise<Technology>}
 */
export const updateTechnologyById = async (technologyId, updateBody) => {
	const technology = await getTechnologyById(technologyId);
	if (!technology) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Technology not found');
	}
	if (updateBody.name && (await Technology.isNameExists(updateBody.name, technologyId))) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
	}
	Object.assign(technology, updateBody);
	await technology.save();
	return technology;
};

/**
 * Delete technology by id
 * @param {ObjectId} technologyId
 * @returns {Promise<Technology>}
 */
export const deleteTechnologyById = async (technologyId) => {
	const technology = await getTechnologyById(technologyId);
	if (!technology) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Technology not found');
	}
	await technology.deleteOne();
	return technology;
};

export default {
	addTechnology,
	queryTechnology,
	getTechnologyById,
	getTechnologyByName,
	updateTechnologyById,
	deleteTechnologyById,
};
