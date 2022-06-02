import { domainService, nats } from 'config';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import processRouter from './routers/v1/process';
import { natsMessageHandler } from './utilities/messageUtil';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('', processRouter);

const run = async () => {
  // subscribe the subject
  if (global.natsClient) {
    global.natsClient.subscribe(nats.stream, `${nats.subject}.params`, `${nats.consumer}_params`, natsMessageHandler);
  }

  return new Promise((resolve, reject) => {
    app.listen(domainService.apc.port, () => {
      resolve();
    });
  });
};

export default {
  run,
};
