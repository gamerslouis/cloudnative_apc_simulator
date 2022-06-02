import { Cache } from '../cache';
import { natsMessageHandler } from '../messageUtil';

describe('Module messageUtil', () => {
  const fakeType = 'FACTOR_THICKNESS';
  const fakeFactor = 0.5;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Method natsMessageHandler for success', async () => {
    global.cache = {
      set: jest.fn().mockReturnValueOnce(true),
    } as unknown as Cache;

    natsMessageHandler(
      JSON.stringify({
        type: fakeType,
        factor: fakeFactor,
      }),
    );

    expect(global.cache.set).toHaveBeenCalledWith(fakeType, fakeFactor);
  });

  it('Method natsMessageHandler for failed', async () => {
    global.cache = {
      set: jest.fn().mockReturnValueOnce(true),
    } as unknown as NodeCache;

    natsMessageHandler(
      JSON.stringify({
        type: 'FAKE_TYPE',
        factor: fakeFactor,
      }),
    );

    expect(global.cache.set).toBeCalledTimes(0);
  });
});