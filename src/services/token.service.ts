import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import userService from './user.service';
import { Token } from '../models';
import ApiError from '../utils/ApiError';
import { TOKEN_TYPE } from '../config/constant';

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
export const saveToken = async (token, userId, expires, type, blacklisted = false) => {
	const tokenDoc = await Token.create({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
		blacklisted,
	});
	return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const verifyToken = async (token, type) => {
	const payload = jwt.verify(token, config.jwt.secret);
	const tokenDoc = await Token.findOne({
		token,
		type,
		user: payload.sub,
		blacklisted: false,
	});
	if (!tokenDoc) {
		throw new Error('Token not found');
	}
	return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokens = async (user) => {
	let refreshTokenDoc: any = await Token.findOne({ user: user._id });
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, TOKEN_TYPE.ACCESS);

	const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
	if (!refreshTokenDoc) {
		const refreshToken = generateToken(user.id, refreshTokenExpires, TOKEN_TYPE.REFRESH);
		await saveToken(refreshToken, user.id, refreshTokenExpires, TOKEN_TYPE.REFRESH);

		refreshTokenDoc = {};
		refreshTokenDoc.token = refreshToken;
	}

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshTokenDoc.token,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email) => {
	const user = await userService.getUserByEmail(email);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
	}
	const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
	const resetPasswordToken = generateToken(user.id, expires, TOKEN_TYPE.RESET_PASSWORD);
	await saveToken(resetPasswordToken, user.id, expires, TOKEN_TYPE.RESET_PASSWORD);
	return resetPasswordToken;
};

export default {
	generateToken,
	saveToken,
	verifyToken,
	generateAuthTokens,
	generateResetPasswordToken,
};
