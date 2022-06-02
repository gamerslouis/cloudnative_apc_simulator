import request from 'supertest';
import NATSClient from '../../utilities/natsClient';
import app from '../app';

describe('Params Service app', () => {
  const mockNats = jest.fn();

  beforeEach(() => {
    global.natsClient = {
      publish: mockNats,
    } as unknown as NATSClient;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('can accept thickness modify request and push to nats', async () => {
    const resp = await request(app)
      .post('/api/v1/factor/thickness')
      .send({ factor: 0.1 });

    expect(resp.body.ok).toBe(true);
    expect(mockNats).toBeCalledTimes(1);
    expect(mockNats).toBeCalledWith('testbed.subject.params', {
      type: 'FACTOR_THICKNESS',
      factor: 0.1,
    });
  });

  it('can accept moisture modify request and push to nats', async () => {
    const resp = await request(app)
      .post('/api/v1/factor/moisture')
      .send({ factor: 0.1 });

    expect(resp.body.ok).toBe(true);
    expect(mockNats).toBeCalledTimes(1);
    expect(mockNats).toBeCalledWith('testbed.subject.params', {
      type: 'FACTOR_MOISTURE',
      factor: 0.1,
    });
  });

  it('can return 503 fail if no nats init', async () => {
    global.natsClient = undefined;
    const resp = await request(app)
      .post('/api/v1/factor/moisture')
      .send({ factor: 0.1 });
    expect(resp.status).toBe(503);
  });

  it('can return 400 fail if accept invalid type', async () => {
    const resp = await request(app)
      .post('/api/v1/factor/fake')
      .send({ factor: 0.1 });

    expect(resp.status).toBe(400);
    expect(resp.body.ok).toBe(false);
  });

  it('can return 500 if accept unexpect error', async () => {
    global.natsClient = {
      publish: () => {
        throw new Error('errortext');
      },
    } as unknown as NATSClient;
    const resp = await request(app)
      .post('/api/v1/factor/moisture')
      .send({ factor: 0.1 });

    expect(resp.status).toBe(500);
    expect(resp.body.ok).toBe(false);
    expect(resp.body.message).toBe('errortext');
  });
});
