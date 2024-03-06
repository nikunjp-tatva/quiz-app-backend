import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';
import Token from '../models/token.model';
import ApiError from '../utils/ApiError';
import { TOKEN_TYPE } from '../config/constant';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password) => {
	const user: any = await userService.getUserByEmail(email);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	}
	return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken) => {
	const refreshTokenDoc: any = await Token.findOne({
		token: refreshToken,
		type: TOKEN_TYPE.REFRESH,
		blacklisted: false,
	});
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
	}
	await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken) => {
	try {
		const refreshTokenDoc: any = await tokenService.verifyToken(
			refreshToken,
			TOKEN_TYPE.REFRESH,
		);
		const user = await userService.getUserById(refreshTokenDoc.user);
		if (!user) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect refreshToken');
		}
		await refreshTokenDoc.deleteOne();
		return tokenService.generateAuthTokens(user);
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
	}
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const resetPassword = async (resetPasswordToken, newPassword) => {
	try {
		const resetPasswordTokenDoc = await tokenService.verifyToken(
			resetPasswordToken,
			TOKEN_TYPE.RESET_PASSWORD,
		);
		const user = await userService.getUserById(resetPasswordTokenDoc.user);
		if (!user) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
		}
		await userService.updateUserById(user.id, { password: newPassword });
		await Token.deleteMany({ user: user.id, type: TOKEN_TYPE.RESET_PASSWORD });
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
	}
};

export default {
	loginUserWithEmailAndPassword,
	logout,
	refreshAuth,
	resetPassword,
};
