// @ts-expect-error ts-migrate(2614) FIXME: Module '"../strategyUtil"' has no exported member ... Remove this comment to see the full error message
import { sharonStrategy, defaultStrategy } from '../strategyUtil';

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Module strategyUtil', () => {
  const fakeThickness = 2.0;
  const fakeMoisture = 0.65;
  const fakeTFactor = 0.5;
  const fakeMFactor = 0.5;

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Method sharonStrategy', () => {
    const res = sharonStrategy(fakeThickness, fakeTFactor);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(res).toStrictEqual({
      period: 20,
      temperature: (fakeThickness * fakeTFactor).toFixed(2),
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Method defaultStrategy', () => {
    const res = defaultStrategy(fakeMoisture, fakeMFactor);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(res).toStrictEqual({
      period: (fakeMoisture * fakeMFactor).toFixed(2),
      temperature: 100,
    });
  });
});
