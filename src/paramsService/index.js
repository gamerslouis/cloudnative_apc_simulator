const { cron, domainService } = require('config');

const axios = require('axios');

const express = require('express');
const { json, urlencoded } = require('body-parser');
const cors = require('cors');

const factorRouter = require('./routers/v1/factor');

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('', factorRouter);

const run = async () => {
  return new Promise((resolve, reject) => {
    app.listen(domainService.params.port, () => {
      const handler = setInterval(async () => {
        const tFactor = Math.random().toFixed(2);
        const mFactor = Math.random().toFixed(2);

        await axios.post(`${domainService.params.endpoint}/api/v1/factor/thickness`, { factor: tFactor });
        await axios.post(`${domainService.params.endpoint}/api/v1/factor/moisture`, { factor: mFactor });
      }, cron.paramsPeriod);

      resolve(handler);
    });
  });
};

module.exports = {
  run,
};
