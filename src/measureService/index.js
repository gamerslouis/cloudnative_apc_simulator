const { cron, domainService } = require('config');

const axios = require('axios');
const uuidv4 = require('uuid').v4;

const types = ['SHARON', 'RIB_EYE'];

const run = async () => {
  const handler = setInterval(async () => {
    const index = Math.floor((Math.random() * 10) % types.length);
    const id = uuidv4();

    const payload = {
      id,
      type: types[index],
      thickness: 2 + Math.random().toFixed(2),
      moisture: 6 + Math.random().toFixed(2),
    };

    const { data } = await axios.post(`${domainService.apc.endpoint}/api/v1/process`, payload);
  }, cron.measurePeriod);

  return handler;
};

module.exports = {
  run,
};
