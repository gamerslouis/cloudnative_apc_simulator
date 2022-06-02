export const defaultStrategy = (moisture: any, mFactor: any) => {
  const period = (moisture * mFactor).toFixed(2);

  return {
    period,
    temperature: 100,
  };
};

export const sharonStrategy = (thickness: any, tFactor: any) => {
  const temperature = (thickness * tFactor).toFixed(2);

  return {
    period: 20,
    temperature,
  };
};
