// @ts-expect-error ts-migrate(2614) FIXME: Module '"../messageUtil"' has no exported member '... Remove this comment to see the full error message
import { natsMessageHandler } from '../messageUtil';

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Module messageUtil', () => {
  const fakeType = 'FACTOR_THICKNESS';
  const fakeFactor = 0.5;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.clearAllMocks();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Method natsMessageHandler for success', async () => {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    global.cache = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      set: jest.fn().mockReturnValueOnce(true),
    };

    natsMessageHandler(
      JSON.stringify({
        type: fakeType,
        factor: fakeFactor,
      })
    );

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(global.cache.set).toHaveBeenCalledWith(fakeType, fakeFactor);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Method natsMessageHandler for failed', async () => {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    global.cache = {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      set: jest.fn().mockReturnValueOnce(true),
    };

    natsMessageHandler(
      JSON.stringify({
        type: 'FAKE_TYPE',
        factor: fakeFactor,
      })
    );

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(global.cache.set).toBeCalledTimes(0);
  });
});
