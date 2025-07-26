import { createLogger, format } from 'winston'
import { Console, File } from 'winston/lib/winston/transports';

const { combine, errors, json, timestamp, colorize } = format;

const errorsFilter = format((info, opts) => {
  return info.level === 'error' ? info : false;
})

const logger = createLogger({
  level: 'info',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json(),
  ),
  transports: [
    new File({
      filename: 'combined.log'
    }),
    new File({
      filename: 'error.log',
      level: 'error',
      format: combine(
        errorsFilter(),
        errors({ stack: true }),
        timestamp(),
        json(),
      ),
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new Console({
    format: combine(
      errors({ stack: true }),
      timestamp(),
      colorize({ all: true })
    ),
  }))
}

export default logger;