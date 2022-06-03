import dotenv from 'dotenv';
dotenv.config();

import { nats, mongodb } from 'config';
import Logger from './utilities/logger';
import NATSClient from './utilities/natsClient';
import measureService from './measureService';
import * as apcService from './apcService';
import * as paramsService from './paramsService';
import { Cache, MongoDBCacheAdapter } from './apcService/utilities/cacheUtil';

declare global {
  var cache: Cache;
  var natsClient: NATSClient;
}

const logger = new Logger('INDEX');
let measureHandle: any = null;
let paramsHandle: any = null;

const initGlobalNATSClient = async () => {
  // instantiate the nats client
  global.natsClient = NATSClient.instance();

  const connection = process.env.NATS_SERVICE_CONNECTION || nats.connection;

  logger.info(`nats-server connection: ${connection}`);

  await global.natsClient.connect(nats.name, [connection]);

  // clear stream and consumer by existence
  let stream = await global.natsClient.getStream(nats.stream);
  if (stream) {
    let consumer = await global.natsClient.getConsumer(
      nats.stream,
      `${nats.consumer}_params`,
    );
    if (consumer) {
      await global.natsClient.deleteConsumer(
        nats.stream,
        `${nats.consumer}_params`,
      );
    }
    await global.natsClient.deleteStream(nats.stream);
  }

  // add the stream
  await global.natsClient.addStream(nats.stream, [`${nats.subject}.>`]);

  // add the consumer
  await global.natsClient.addConsumer(
    nats.stream,
    `${nats.subject}.params`,
    `${nats.consumer}_params`,
  );
};

const initGlobalCache = async () => {
  global.cache = new MongoDBCacheAdapter(mongodb.uri, mongodb.collection);
  global.cache.set('FACTOR_THICKNESS', 0.5);
  global.cache.set('FACTOR_MOISTURE', 0.5);
};

const run = async () => {
  // initialize the global resource
  await initGlobalNATSClient();
  await initGlobalCache();

  // run all services
  await apcService.run();
  paramsHandle = await paramsService.run();
  measureHandle = await measureService.run();
};

run();

process.on('SIGINT', async () => {
  if (global.cache) {
    await global.cache.close();
    global.cache = null;
  }

  if (global.natsClient) {
    await global.natsClient.disconnect();
    global.natsClient = null;
  }

  if (paramsHandle) {
    clearInterval(paramsHandle);
  }

  if (measureHandle) {
    clearInterval(measureHandle);
  }

  process.exit();
});
