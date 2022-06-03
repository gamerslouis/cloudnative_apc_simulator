module.exports = {
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: [
    'clover',
    'json',
    'lcov',
    'text',
    'text-summary',
    'json-summary',
  ],
};
