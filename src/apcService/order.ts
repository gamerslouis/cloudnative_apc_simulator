export class Order {
  public type: string;
  public moisture: number;
  public thickness: number;

  constructor(type: string, moisture: number, thickness: number) {
    this.type = type;
    this.moisture = moisture;
    this.thickness = thickness;
  }
}

export class OrderContext {
  public tFactor: number;
  public mFactor: number;
  public order: Order;

  private constructor() {}

  static async instatnce(order: Order): Promise<OrderContext> {
    let ctx = new OrderContext();
    ctx.tFactor = await global.cache.get('FACTOR_THICKNESS');
    ctx.mFactor = await global.cache.get('FACTOR_MOISTURE');
    ctx.order = order;
    return ctx;
  }
}
