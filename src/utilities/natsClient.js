import { connect, StringCodec, consumerOpts, credsAuthenticator, AckPolicy } from 'nats';
import loggerFactory from './logger';
const logger = loggerFactory('NATSClient');

class NATSClient {
  constructor() {
    this.nc = null;
    this.jsm = null;
    this.js = null;
    this.sc = StringCodec();
    this.subs = {};
    this.handler = null;
  }

  async connect(name, servers, creds = null, apiPrefix = null) {
    try {
      this.nc = await connect({
        name,
        servers,
        ...(creds ? { authenticator: credsAuthenticator(new TextEncoder().encode(creds)) } : {}),
      });

      this.jsm = await this.nc.jetstreamManager({
        ...(apiPrefix ? { apiPrefix } : {}),
      });

      this.js = await this.nc.jetstream({
        ...(apiPrefix ? { apiPrefix } : {}),
      });

      this.handler = setInterval(() => {
        for (let sub of Object.values(this.subs)) {
          sub.pull({ batch: 10, expires: 10000 });
        }
      }, 10000);

      logger.info('Successfully connect to NATS', { module: 'natsClient', method: 'connect' });
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'connect' });
      throw err;
    }
  }

  async disconnect() {
    try {
      // unsubscribe the subscription
      if (this.subs) {
        const subjects = Object.keys(this.subs);
        for (let subject of subjects) {
          await this.unsubscribe(subject);
        }
      }

      // clear the interval with handler
      if (this.handler) {
        clearInterval(this.handler);
      }

      // close the connection
      if (this.nc) {
        const done = this.nc.closed();
        await this.nc.close();

        const err = await done;
        if (err) {
          throw err;
        }
      }

      this.nc = null;
      this.jsm = null;
      this.js = null;
      this.subs = {};
      this.handler = null;

      logger.info('Successfully disconnect to NATS', { module: 'natsClient', method: 'disconnect' });
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'disconnect' });
      throw err;
    }
  }

  isConnected() {
    if (!this.nc) {
      return false;
    }
    return true;
  }

  async listStreams() {
    try {
      const res = await this.jsm.streams.list().next();
      return res;
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'listStreams' });

      return [];
    }
  }

  async getStream(stream) {
    try {
      const res = await this.jsm.streams.info(stream);
      return res;
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'getStream' });

      return null;
    }
  }

  async addStream(stream, subjects) {
    try {
      const res = await this.jsm.streams.add({ name: stream, subjects });
      return res;
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'addStream' });

      throw err;
    }
  }

  async deleteStream(stream) {
    try {
      const res = await this.jsm.streams.delete(stream);
      return res;
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'deleteStream' });

      return;
    }
  }

  async listConsumers(stream) {
    try {
      const res = await this.jsm.consumers.list(stream).next();
      return res;
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'listConsumers' });

      return [];
    }
  }

  async getConsumer(stream, consumer) {
    try {
      const res = await this.jsm.consumers.info(stream, consumer);
      return res;
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'getConsumer' });

      return null;
    }
  }

  async addConsumer(stream, subject, consumer) {
    try {
      const res = await this.jsm.consumers.add(stream, {
        durable_name: consumer,
        ack_policy: AckPolicy.Explicit,
        filter_subject: subject,
      });
      return res;
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'addConsumer' });
      throw err;
    }
  }

  async deleteConsumer(stream, consumer) {
    try {
      const res = await this.jsm.consumers.delete(stream, consumer);
      return res;
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'deleteConsumer' });
      throw err;
    }
  }

  async publish(subject, obj) {
    try {
      const pa = await this.js.publish(subject, this.sc.encode(JSON.stringify(obj)));
      return pa;
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'publish' });
      throw err;
    }
  }

  async subscribe(stream, subject, consumerName, callback) {
    try {
      if (this.subs[subject]) {
        return;
      }

      if (!callback) {
        throw new Error('the callback is null');
      }

      const opts = consumerOpts();
      opts.manualAck();
      opts.ackExplicit();
      opts.filterSubject(subject);

      if (consumerName) {
        opts.durable(consumerName);
        opts.bind(stream, consumerName);
      }

      const sub = await this.js.pullSubscribe(subject, opts);
      this.subs[subject] = sub;

      const done = (async () => {
        for await (const m of sub) {
          callback(this.sc.decode(m.data));

          m.ack();
        }
      })();
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'subscribe' });
      throw err;
    }
  }

  async unsubscribe(subject) {
    try {
      if (!this.subs[subject]) {
        return;
      }

      await this.subs[subject].unsubscribe();
      await this.subs[subject].destroy();

      delete this.subs[subject];
    } catch (err) {
      logger.error(err.message, { module: 'natsClient', method: 'unsubscribe' });
    }
  }
}

NATSClient._instance = null;
NATSClient.instance = () => {
  if (!NATSClient._instance) {
    NATSClient._instance = new NATSClient();
  }
  return NATSClient._instance;
};

export default NATSClient;
