import { createLogger, format, transports } from 'winston'
import { isDev } from './is-dev'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'all.log', level: 'verbose' }),
  ],
})

if (isDev) {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
    ),
    level: 'silly',
  }))
}

export default logger
