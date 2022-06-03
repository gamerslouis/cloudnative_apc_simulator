const dotenv = require('dotenv');
dotenv.config();

const { nats, mongodb } = require('config');

const NodeCache = require('node-cache');

const cacheManager = require('cache-manager');
const mongoStore = require('cache-manager-mongodb');
const ttl = 60;

const logger = require('./utilities/logger')('INDEX');
const NATSClient = require('./utilities/natsClient');

const measureService = require('./measureService');
const apcService = require('./apcService');
const paramsService = require('./paramsService');

let measureHandle = null;
let paramsHandle = null;

const initGlobalNATSClient = async () => {
  // instantiate the nats client
  global.natsClient = NATSClient.instance();

  const connection = process.env.NATS_SERVICE_CONNECTION || nats.connection;

  logger.info(`nats-server connection: ${connection}`);

  await global.natsClient.connect(nats.name, [connection]);

  // clear stream and consumer by existence
  let stream = await global.natsClient.getStream(nats.stream);
  if (stream) {
    let consumer = await global.natsClient.getConsumer(nats.stream, `${nats.consumer}_params`);
    if (consumer) {
      await global.natsClient.deleteConsumer(nats.stream, `${nats.consumer}_params`);
    }
    await global.natsClient.deleteStream(nats.stream);
  }

  // add the stream
  await global.natsClient.addStream(nats.stream, [`${nats.subject}.>`]);

  // add the consumer
  await global.natsClient.addConsumer(nats.stream, `${nats.subject}.params`, `${nats.consumer}_params`);
};

const initGlobalCache = async () => {


  // global.mongoCache = new NodeCache();
  // global.mongoCache.set('FACTOR_THICKNESS', 0.5);
  // global.mongoCache.set('FACTOR_MOISTURE', 0.5);


  global.mongoCache = cacheManager.caching({
    store : mongoStore,
    uri : mongodb.uri,
    options : {
      collection : mongodb.collection,
      compression : false,
      poolSize : 10,
      autoReconnect: true
    }
  });

  let tFactorPromise = global.mongoCache.get('FACTOR_THICKNESS');
  
  tFactorPromise.then(function(tFactor) {
    console.log('tFactor: ', tFactor);
    if (typeof tFactor  != "undefined"){
      console.log('retrieve FACTOR_THICKNESS: ', tFactor);
      global.mongoCache.set('FACTOR_THICKNESS', tFactor, ttl);
      let mFactorPromise = global.mongoCache.get('FACTOR_MOISTURE');
      mFactorPromise.then(function(mFactor) {
        console.log('mFactor: ', mFactor);
        if (typeof mFactor  != "undefined"){
          console.log('retrieve FACTOR_MOISTURE: ', mFactor);
          global.mongoCache.set('FACTOR_MOISTURE', mFactor, ttl);
        }else{
          console.log('store initial FACTOR_MOISTURE: 0.5');
          global.mongoCache.set('FACTOR_MOISTURE', 0.5, ttl);
        }
      });
    }else{
      console.log('store initial FACTOR_THICKNESS: 0.5');
      global.mongoCache.set('FACTOR_THICKNESS', 0.5, ttl);
      let mFactorPromise = global.mongoCache.get('FACTOR_MOISTURE');
      mFactorPromise.then(function(mFactor) {
        console.log('mFactor: ', mFactor);
        if (typeof mFactor  != "undefined"){
          console.log('retrieve FACTOR_MOISTURE: ', mFactor);
          global.mongoCache.set('FACTOR_MOISTURE', mFactor, ttl);
        }else{
          console.log('store initial FACTOR_MOISTURE: 0.5');
          global.mongoCache.set('FACTOR_MOISTURE', 0.5, ttl);
        }
      });
    }
  });
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
