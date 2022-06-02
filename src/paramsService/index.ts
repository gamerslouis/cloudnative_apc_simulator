import { cron, domainService } from 'config';
import axios from 'axios';
import app from './app';

const run = async () => {
  return new Promise((resolve, reject) => {
    try {
      app.listen(domainService.params.port, () => {
        const handler = setInterval(() => {
          const tFactor = Math.random().toFixed(2);
          const mFactor = Math.random().toFixed(2);

          axios.post(
            `${domainService.params.endpoint}/api/v1/factor/thickness`,
            { factor: tFactor },
          );
          axios.post(
            `${domainService.params.endpoint}/api/v1/factor/moisture`,
            { factor: mFactor },
          );
        }, cron.paramsPeriod);

        resolve(handler);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  run,
};
