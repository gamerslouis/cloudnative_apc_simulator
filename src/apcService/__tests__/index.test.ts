import { run } from '../index';

let mockListen = jest.fn().mockImplementation((port, callback) => callback());

jest.mock('../app', () => {
  return {
    listen: (port, cb) => mockListen(port, cb),
  };
});

describe('params service index', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  it('start express and handle nats event', async () => {
    await run();
    expect;
  });
});
