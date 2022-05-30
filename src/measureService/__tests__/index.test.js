const axios = require("axios");
const { run } = require("../index");
const { domainService } = require("config");

jest.mock("uuid", () => {
  return {
    v4: () => "uuid.fake",
  };
});
jest.mock("axios");
jest.useFakeTimers();

describe("Measure service", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("can periodically post new request", async () => {
    await run();
    jest.runOnlyPendingTimers();
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${domainService.apc.endpoint}/api/v1/process`,
      {
        id: "uuid.fake",
        type: "SHARON",
        thickness: "20.00",
        moisture: "60.00",
      }
    );
  });
});
