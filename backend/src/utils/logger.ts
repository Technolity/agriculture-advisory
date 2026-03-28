/**
 * Structured Logger
 * Pino-based logging with pretty printing in development
 * @module utils/logger
 */

import pino from 'pino';

/** Application logger instance */
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  base: {
    service: 'agricultural-advisory-api',
    version: '1.0.0',
  },
});

export default logger;
