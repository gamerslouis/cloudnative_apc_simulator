import axios from 'axios';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'conf... Remove this comment to see the full error message
import { domainService } from 'config';
// @ts-expect-error ts-migrate(2614) FIXME: Module '"../index"' has no exported member 'run'. ... Remove this comment to see the full error message
import { run } from '../index';

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock("axios");
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.useFakeTimers();

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
let mockListen = jest.fn();

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock("../app", () => {
  return {
    listen: (port: any, callback: any) => mockListen(port, callback),
  };
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("params service index", () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("start express and periodically update apc params", async () => {
    mockListen.mockImplementationOnce((port: any, callback: any) => {
      callback();
    });
    const handle = await run();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.runOnlyPendingTimers();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(axios.post).toBeCalledTimes(2);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(axios.post).toHaveBeenCalledWith(
      `${domainService.params.endpoint}/api/v1/factor/thickness`,
      { factor: "0.12" }
    );
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(axios.post).toHaveBeenCalledWith(
      `${domainService.params.endpoint}/api/v1/factor/moisture`,
      { factor: "0.12" }
    );
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("run fail if express can't start", async () => {
    mockListen.mockImplementationOnce((port: any, callback: any) => {
      throw new Error("ERR");
    });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    await expect(async () => {
      await run();
    }).rejects.toBeInstanceOf(Error);
  });
});
