import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';
import { createLogger, format, transports } from 'winston';
const { timestamp, printf, combine, splat, label } = format;

const customFormat = printf(({ timestamp, label, message, level, ...metadata }) => {
  return `[${label}] | ${timestamp} | ${level} | ${message} | ${JSON.stringify(metadata)}`;
});

const func = (loggerLabel) => {
  const logger = createLogger({
    level: 'debug',
    format: combine(
      timestamp(),
      label({
        label: loggerLabel,
        message: false,
      }),
      splat(),
      customFormat
    ),
    transports: [new transports.Console({ level: 'debug' })],
  });

  logger.cache = new NodeCache();

  const getDelHandleData = (handle) => {
    const cacheData = logger.cache.get(handle);
    if (cacheData === undefined) {
      return null;
    }
    logger.cache.del(handle);

    return cacheData;
  };

  logger.begin = (metadata) => {
    const handle = uuidv4();
    logger.cache.set(handle, { ts: moment(), metadata });

    return handle;
  };

  logger.end = (handle, metadata = {}, message = 'complete the process') => {
    const cacheData = getDelHandleData(handle);
    if (!cacheData) return;

    const duration = moment().diff(cacheData.ts);

    logger.info(message, { _duration: duration, ...cacheData.metadata, ...metadata });
  };

  logger.fail = (handle, metadata = {}, message = 'the process is faulted') => {
    const cacheData = getDelHandleData(handle);
    if (!cacheData) return;

    const duration = moment().diff(cacheData.ts);

    logger.error(message, { _duration: duration, ...cacheData.metadata, ...metadata });
  };

  return logger;
};

export default func;
