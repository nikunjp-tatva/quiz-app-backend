import { Strategy, ExtractJwt } from 'passport-jwt';
import config from './config';
import { tokenTypes } from './tokens';
import { User } from '../models';

const jwtOptions = {
	secretOrKey: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (
	payload: { type: string; sub: any },
	done: (arg0: null, arg1: any) => void,
) => {
	try {
		if (payload.type !== tokenTypes.ACCESS) {
			throw new Error('Invalid token type');
		}
		const user = await User.findById(payload.sub).select('-password');
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

export const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

export default {
	jwtStrategy,
};
