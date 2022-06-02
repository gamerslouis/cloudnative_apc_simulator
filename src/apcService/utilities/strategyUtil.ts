const defaultStrategy = (moisture, mFactor) => {
  const period = (moisture * mFactor).toFixed(2);

  return {
    period,
    temperature: 100,
  };
};

const sharonStrategy = (thickness, tFactor) => {
  const temperature = (thickness * tFactor).toFixed(2);

  return {
    period: 20,
    temperature,
  };
};

export default {
  defaultStrategy,
  sharonStrategy,
};
