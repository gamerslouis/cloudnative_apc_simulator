import axios from 'axios';
import { domainService } from 'config';
import { run } from '../index';

jest.mock("axios");
jest.useFakeTimers();

let mockListen = jest.fn();

jest.mock("../app", () => {
  return {
    listen: (port, callback) => mockListen(port, callback),
  };
});

describe("params service index", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
  });

  it("start express and periodically update apc params", async () => {
    mockListen.mockImplementationOnce((port, callback) => {
      callback();
    });
    const handle = await run();

    jest.runOnlyPendingTimers();
    expect(axios.post).toBeCalledTimes(2);
    expect(axios.post).toHaveBeenCalledWith(
      `${domainService.params.endpoint}/api/v1/factor/thickness`,
      { factor: "0.12" }
    );
    expect(axios.post).toHaveBeenCalledWith(
      `${domainService.params.endpoint}/api/v1/factor/moisture`,
      { factor: "0.12" }
    );
  });

  it("run fail if express can't start", async () => {
    mockListen.mockImplementationOnce((port, callback) => {
      throw new Error("ERR");
    });
    await expect(async () => {
      await run();
    }).rejects.toBeInstanceOf(Error);
  });
});
