import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'

const logger = createLogger({
  level: 'silly',
  format: format.combine(
    format.json({ space: 2 }),
  ),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs `verbose.log`
    //
    new transports.DailyRotateFile({ 
      dirname: 'logs',
      format: format.combine(
        format.errors({ stack: true }),
        format.json({ space: 2 }),
      ),
      filename: 'error.log', 
      level: 'error',
      maxFiles: '20',
      maxSize: '10mb',
    }),
    new transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'verbose.log',
      maxFiles: '10',
      maxSize: '10mb',
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }),
  ],
})
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    level: process.env.CONSOLE_VERBOSITY ?? 'info',
    format: format.combine(
      format.colorize(),
      format.simple(),
    ),
  }))
}


export default logger
