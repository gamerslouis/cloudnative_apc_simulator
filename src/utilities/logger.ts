import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';
import winston, { createLogger, format, transports } from 'winston';
const { timestamp, printf, combine, splat, label } = format;

const customFormat = printf(
  ({ timestamp, label, message, level, ...metadata }) => {
    return `[${label}] | ${timestamp} | ${level} | ${message} | ${JSON.stringify(
      metadata,
    )}`;
  },
);

export default class Logger {
  logger: winston.Logger;
  cache: NodeCache;

  constructor(loggerLabel: any) {
    this.logger = createLogger({
      level: 'debug',
      format: combine(
        timestamp(),
        label({
          label: loggerLabel,
          message: false,
        }),
        splat(),
        customFormat,
      ),
      transports: [new transports.Console({ level: 'debug' })],
    });
    this.cache = new NodeCache();
  }
  getDelHandleData(handle: any): any {
    const cacheData = this.cache.get(handle);
    if (cacheData === undefined) {
      return null;
    }
    this.cache.del(handle);
    return cacheData;
  }

  begin(metadata: any) {
    const handle = uuidv4();
    this.cache.set(handle, { ts: moment(), metadata });
    return handle;
  }

  end(handle: any, metadata = {}, message = 'complete the process') {
    const cacheData = this.getDelHandleData(handle);
    if (!cacheData) return;
    const duration = moment().diff(cacheData.ts);
    this.logger.info(message, {
      _duration: duration,
      ...cacheData.metadata,
      ...metadata,
    });
  }

  fail(handle: any, metadata = {}, message = 'the process is faulted') {
    const cacheData = this.getDelHandleData(handle);
    if (!cacheData) return;
    const duration = moment().diff(cacheData.ts);
    this.logger.error(message, {
      _duration: duration,
      ...cacheData.metadata,
      ...metadata,
    });
  }

  info(arg0: string, arg1?: { module: string; method: string }) {
    this.logger.info(arg0, arg1);
  }
  error(message: any, arg1?: { module: string; method: string }) {
    this.logger.error(message, arg1);
  }
}
