import { Cache } from '../cacheUtil';
import { natsMessageHandler } from '../messageUtil';

describe('Module messageUtil', () => {
  const fakeTypes = ['FACTOR_THICKNESS', 'FACTOR_MOISTURE'];
  const fakeFactor = 0.5;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Method natsMessageHandler for success', async () => {
    for (let type of fakeTypes) {
      global.cache = {
        set: jest.fn().mockReturnValueOnce(true),
      } as unknown as Cache;

      natsMessageHandler(
        JSON.stringify({
          type: type,
          factor: fakeFactor,
        }),
      );

      expect(global.cache.set).toHaveBeenCalledWith(type, fakeFactor);
    }
  });

  it('Method natsMessageHandler for failed', async () => {
    global.cache = {
      set: jest.fn().mockReturnValueOnce(true),
    } as unknown as Cache;

    natsMessageHandler(
      JSON.stringify({
        type: 'FAKE_TYPE',
        factor: fakeFactor,
      }),
    );
    expect(global.cache.set).toBeCalledTimes(0);

    global.cache = undefined;
    natsMessageHandler(
      JSON.stringify({
        type: 'FAKE_TYPE',
        factor: fakeFactor,
      }),
    );
  });
});
