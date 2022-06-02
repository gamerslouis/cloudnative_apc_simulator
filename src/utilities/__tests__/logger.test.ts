import createLogger from '../logger';
const Conosle = require("winston").transports.Console;
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'trip... Remove this comment to see the full error message
import { MESSAGE } from 'triple-beam';


// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
const mockLog = jest.fn();
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.spyOn(Conosle.prototype, "log").mockImplementation(mockLog);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.useFakeTimers().setSystemTime(1466424490000);

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("Logger", () => {
  let logger: any;
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.clearAllMocks();
    logger = createLogger("test");
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("log finish", () => {
    const handle = logger.begin({});
    logger.end(handle);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockLog.mock.calls[0][0][MESSAGE]).toBe(
      '[test] | 2016-06-20T12:08:10.000Z | info | complete the process | {"_duration":0}'
    );
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("log error", () => {
    const handle = logger.begin({});
    logger.fail(handle);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockLog.mock.calls[0][0][MESSAGE]).toBe(
      '[test] | 2016-06-20T12:08:10.000Z | error | the process is faulted | {"_duration":0}'
    );
  });
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("do no thing if no begin for handle", ()=>{
    const handle = 'fake_handle'
    logger.end(handle)
    logger.fail(handle)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockLog.mock.calls.length).toBe(0)
  })
});
