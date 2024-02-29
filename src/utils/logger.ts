import winston from 'winston';
import config from '../config/config';

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'white',
};

winston.addColors(colors);
const format = winston.format.combine(
	enumerateErrorFormat(),
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
	winston.format.splat(),
	winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const transports = [
	new winston.transports.Console({
		stderrLevels: ['error'],
	}),
];
const logger = winston.createLogger({
	levels,
	format,
	transports,
});

export default logger;
