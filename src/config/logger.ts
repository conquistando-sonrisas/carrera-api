import { createLogger, format } from 'winston'

const { combine, errors, json, timestamp } = format;

const logger = createLogger({
  level: 'info',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json()
  )
});

export default logger;