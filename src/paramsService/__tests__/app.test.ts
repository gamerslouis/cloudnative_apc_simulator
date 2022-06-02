// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest';
import app from '../app';

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("Params Service app", () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
  const mockNats = jest.fn();

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    global.natsClient = {
      publish: mockNats,
    };
  });

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(() => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
    jest.resetAllMocks();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("can accept thickness modify request and push to nats", async () => {
    const resp = await request(app)
      .post("/api/v1/factor/thickness")
      .send({ factor: 0.1 });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(resp.body.ok).toBe(true);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockNats).toBeCalledTimes(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockNats).toBeCalledWith("testbed.subject.params", {
      type: "FACTOR_THICKNESS",
      factor: 0.1,
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("can accept moisture modify request and push to nats", async () => {
    const resp = await request(app)
      .post("/api/v1/factor/moisture")
      .send({ factor: 0.1 });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(resp.body.ok).toBe(true);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockNats).toBeCalledTimes(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(mockNats).toBeCalledWith("testbed.subject.params", {
      type: "FACTOR_MOISTURE",
      factor: 0.1,
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("can return 503 fail if no nats init", async () => {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    global.natsClient = undefined;
    const resp = await request(app)
      .post("/api/v1/factor/moisture")
      .send({ factor: 0.1 });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(resp.status).toBe(503);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("can return 400 fail if accept invalid type", async () => {
    const resp = await request(app)
      .post("/api/v1/factor/fake")
      .send({ factor: 0.1 });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(resp.status).toBe(400);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(resp.body.ok).toBe(false);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("can return 500 if accept unexpect error", async () => {
    // @ts-expect-error ts-migrate(7017) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    global.natsClient = {
      publish: () => {
        throw new Error("errortext");
      },
    };
    const resp = await request(app)
      .post("/api/v1/factor/moisture")
      .send({ factor: 0.1 });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(resp.status).toBe(500);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(resp.body.ok).toBe(false);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(resp.body.message).toBe("errortext");
  });
});
