import { domainService, nats } from 'config';
import { natsMessageHandler } from './utilities/messageUtil';

import app from './app';

export const run = async () => {
  // subscribe the subject
  if (global.natsClient) {
    global.natsClient.subscribe(
      nats.stream,
      `${nats.subject}.params`,
      `${nats.consumer}_params`,
      natsMessageHandler,
    );
  }

  return new Promise((resolve, reject) => {
    app.listen(domainService.apc.port, () => {
      resolve(undefined);
    });
  });
};
