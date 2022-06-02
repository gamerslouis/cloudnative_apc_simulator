import { nats } from 'config';
import express from 'express';
import loggerFactory from '../../../utilities/logger';
const logger = loggerFactory("PARAMS_SERVICE");

const router = express.Router();

router.post("/api/v1/factor/:type", async (req, res) => {
  const { factor } = req.body;
  const { type } = req.params;
  const TYPE_STR = `FACTOR_${type.toUpperCase()}`;

  const handle = logger.begin({ factor });

  if (!["thickness", "moisture"].includes(type)) {
    return res.status(400).send({
      ok: false,
      message: `${type} is not a valid type`,
    });
  }

  try {
    if (!global.natsClient) {
      return res.status(503).send({
        ok: false,
        message: "the natsClient is not existed",
      });
    }
    await global.natsClient.publish(`${nats.subject}.params`, {
      type: TYPE_STR,
      factor,
    });

    logger.end(handle, {}, `publish the ${type} factor: ${factor}`);

    return res.status(200).send({
      ok: true,
    });
  } catch (err) {
    logger.fail(handle, {}, err.message);

    return res.status(500).send({
      ok: false,
      message: err.message,
    });
  }
});

export default router;
