import express from 'express';
import Logger from '../../../utilities/logger';
import { Order, OrderContext } from '../../order';
import { StrategyFactory } from '../../strategy';

const logger = new Logger('APC_SERVICE');
const router = express.Router();

router.post('/api/v1/process', async (req: any, res: any) => {
  const { id, type, thickness, moisture } = req.body;

  const handle = logger.begin({
    id,
    type,
    thickness,
    moisture,
  });

  try {
    if (!global.cache) {
      throw new Error('the global cache is not existed');
    }

    const order = new Order(type, moisture, thickness);
    const ctx = await OrderContext.instatnce(order);
    const result = new StrategyFactory().applyTo(ctx);
    const data = {
      ...result,
      tFactor: ctx.tFactor,
      mFactor: ctx.mFactor,
    };

    logger.end(handle, data, `process (${id}) of APC has completed`);

    return res.status(200).send({
      ok: true,
      data: data,
    });
  } catch (err) {
    logger.fail(handle, {}, err.message);

    return res.status(500).send({ ok: false, message: err.message });
  }
});

export default router;
