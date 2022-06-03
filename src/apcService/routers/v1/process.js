const express = require('express');

const { defaultStrategy, sharonStrategy } = require('../../utilities/strategyUtil');

const logger = require('../../../utilities/logger')('APC_SERVICE');

const router = express.Router();

router.post('/api/v1/process', async (req, res) => {
  const { id, type, thickness, moisture } = req.body;

  const handle = logger.begin({
    id,
    type,
    thickness,
    moisture,
  });

  try {
    if (!global.mongoCache) {
      throw new Error('the mongo cache is not existed');
    }

    global.mongoCache.get('FACTOR_THICKNESS').then(function(tFactorResult){
      const tFactor = tFactorResult;
      global.mongoCache.get('FACTOR_MOISTURE').then(function(mFactorResult){
        const mFactor = mFactorResult;
        let data = null;
        if (type === 'SHARON') {
          data = sharonStrategy(thickness, tFactor);
        } else {
          data = defaultStrategy(moisture, mFactor);
        }
        logger.end(handle, { tFactor, mFactor, ...data }, `process (${id}) of APC has completed`);
        return res.status(200).send({ ok: true, data: { ...data, tFactor, mFactor } });
      });
    });
  } catch (err) {
    logger.fail(handle, { tFactor, mFactor }, err.message);

    return res.status(500).send({ ok: false, message: err.message });
  }
});

module.exports = router;
