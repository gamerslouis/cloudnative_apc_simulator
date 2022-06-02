import express from 'express';
import Logger from '../../../utilities/logger';
const logger = new Logger('APC_SERVICE');
import {getStrategy} from './getStrategy'
const router = express.Router();

export class OrderContext {
  public tFactor: number;
  public mFactor: number;
  public moisture: number;
  public thickness: number;

  constructor(moisture: number, thickness: number)
  {
      this.tFactor=global.cache.get('FACTOR_THICKNESS');
      this.mFactor=global.cache.get('FACTOR_MOISTURE');
      this.moisture=moisture;
      this.thickness=thickness
  }
}

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


    const order: OrderContext = new OrderContext(moisture,thickness)
    const strategy = getStrategy(type)
    let data = strategy.apply(order)
    let t=order.tFactor
    let m=order.mFactor

    logger.end(handle, { t, m, ...data }, `process (${id}) of APC has completed`);

    return res.status(200).send({ ok: true, data: { ...data, t, m } });
  } catch (err) {
    logger.fail(handle, {}, err.message);

    return res.status(500).send({ ok: false, message: err.message });
  }
});

export default router;
