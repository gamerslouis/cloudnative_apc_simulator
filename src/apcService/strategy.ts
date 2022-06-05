import { OrderContext } from './order';

type APCResult = {
  period: String | number;
  temperature: String | number;
};

export interface Strategy {
  applyTo(ctx: OrderContext): APCResult;
}

export class DefaultStrategy implements Strategy {
  public applyTo(ctx: OrderContext): APCResult {
    let result: APCResult = {
      period: (ctx.order.moisture * ctx.mFactor).toFixed(2),
      temperature: '100.00',
    };
    return result;
  }
}

export class SharonStrategy implements Strategy {
  public applyTo(ctx: OrderContext): APCResult {
    let result: APCResult = {
      period: '20.00',
      temperature: (ctx.order.thickness * ctx.tFactor).toFixed(2),
    };
    return result;
  }
}

export class TboneStrategy implements Strategy {
  public applyTo(ctx: OrderContext): APCResult {
    let result: APCResult = {
      period: '25.00',
      temperature: (ctx.order.thickness * ctx.tFactor).toFixed(2),
    };
    return result;
  }
}

export class AngusStrategy implements Strategy {
  public applyTo(ctx: OrderContext): APCResult {
    let result: APCResult = {
      period: (ctx.order.moisture * ctx.mFactor).toFixed(2),
      temperature: (ctx.order.thickness * ctx.tFactor).toFixed(2),
    };
    return result;
  }
}

export class StrategyFactory {
  applyTo(ctx: OrderContext): APCResult {
    return this.getStrategy(ctx).applyTo(ctx);
  }

  getStrategy(ctx: OrderContext): Strategy {
    if (ctx.order.type == 'SHARON') {
      return new SharonStrategy();
    } else if (ctx.order.type == 'TBONE') {
      return new TboneStrategy();
    } else if (ctx.order.type == 'ANGUS') {
      return new AngusStrategy();
    } else {
      return new DefaultStrategy();
    }
  }
}
