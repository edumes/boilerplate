import { env } from '@config/env.config';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

/**
 * Log levels configuration
 * @property error - Error level (0)
 * @property warn - Warning level (1)
 * @property info - Info level (2)
 * @property http - HTTP level (3)
 * @property debug - Debug level (4)
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

/**
 * Log level colors configuration
 * @property error - Red color for error level
 * @property warn - Yellow color for warning level
 * @property info - Green color for info level
 * @property http - Magenta color for HTTP level
 * @property debug - Blue color for debug level
 */
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(colors);

/**
 * Winston logger format configuration
 * Combines multiple formats:
 * - Metadata
 * - Timestamp
 * - Error stack traces
 * - Custom error console output
 * - JSON output
 */
const format = winston.format.combine(
  winston.format.metadata(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format((info: any) => {
    if (info.level === 'error') {
      console.error(info?.metadata?.error);
    }
    return info;
  })(),
  winston.format.json()
);

/**
 * Winston logger transports configuration
 * Includes:
 * - Console transport with colorized output
 * - Daily rotating file for errors
 * - Daily rotating file for all logs
 */
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        info => `[\x1b[34m${info.timestamp}\x1b[0m] \x1b[107m${info.level}\x1b[0m ${info.message}`
      )
    )
  }),
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d'
  }),
  new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
  })
];

/**
 * Winston logger instance
 * Configured with:
 * - Environment-based log level
 * - Custom log levels
 * - Combined format
 * - Multiple transports
 */
export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports
});
