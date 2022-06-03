import supertest from 'supertest';
import app from '../app';
import { NodeCacheAdapter } from '../utilities/cacheUtil';

const tasks = [
  ['1', 'SHARON', 1.0, 2.0, '20.00', '1.00', 1, 7],
  ['2', 'RIB_EYE', 1.0, 2.0, '12.00', '100.00', 2, 6],
  ['3', 'TBONE', 1.0, 2.0, '25.00', '3.00', 3, 5],
  ['4', 'ANGUS', 1.0, 2.0, '8.00', '4.00', 4, 4],
  ['5', 'WAGYU', 1.0, 2.0, '6.00', '100.00', 5, 3],
  ['6', 'FILET', 1.0, 2.0, '4.00', '100.00', 6, 2],
  ['7', 'STRIP', 1.0, 2.0, '2.00', '100.00', 7, 1],
];

describe('apc service', () => {
  it('can work', async () => {
    global.cache = new NodeCacheAdapter();
    for (let task of tasks) {
      const [
        id,
        type,
        thickness,
        moisture,
        period,
        temperature,
        tFactor,
        mFactor,
      ] = task;

      await global.cache.set('FACTOR_THICKNESS', tFactor as number);
      await global.cache.set('FACTOR_MOISTURE', mFactor as number);

      const resp = await supertest(app).post('/api/v1/process').send({
        id,
        type,
        thickness,
        moisture,
      });
      expect(resp.status).toBe(200);
      expect(resp.body.ok).toBe(true);
      expect(resp.body.data).toStrictEqual({
        period,
        temperature,
        tFactor,
        mFactor,
      });
    }
  });
  it('can fail if no cache', async () => {
    global.cache = undefined;
    let resp = await supertest(app).post('/api/v1/process').send({});
    expect(resp.status).toBe(500);
    expect(resp.body.ok).toBe(false);
  });
});
