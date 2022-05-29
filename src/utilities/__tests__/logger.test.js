const createLogger = require("../logger");
const Conosle = require("winston").transports.Console;
const { MESSAGE } = require("triple-beam");


const mockLog = jest.fn();
jest.spyOn(Conosle.prototype, "log").mockImplementation(mockLog);
jest.useFakeTimers().setSystemTime(1466424490000);

describe("Logger", () => {
  let logger;
  beforeEach(() => {
    jest.clearAllMocks();
    logger = createLogger("test");
  });

  it("log finish", () => {
    const handle = logger.begin({});
    logger.end(handle);
    expect(mockLog.mock.calls[0][0][MESSAGE]).toBe(
      '[test] | 2016-06-20T12:08:10.000Z | info | complete the process | {"_duration":0}'
    );
  });

  it("log error", () => {
    const handle = logger.begin({});
    logger.fail(handle);
    expect(mockLog.mock.calls[0][0][MESSAGE]).toBe(
      '[test] | 2016-06-20T12:08:10.000Z | error | the process is faulted | {"_duration":0}'
    );
  });
  it("do no thing if no begin for handle", ()=>{
    const handle = 'fake_handle'
    logger.end(handle)
    logger.fail(handle)
    expect(mockLog.mock.calls.length).toBe(0)
  })
});
