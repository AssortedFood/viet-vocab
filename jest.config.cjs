// jest.config.cjs
module.exports = {
  roots: ['<rootDir>/tests'],
  testEnvironment: 'jest-environment-jsdom',
  // Polyfill fetch for OpenAI
  setupFiles: ['openai/shims/node'],
  // Then any additional setup
  setupFilesAfterEnv: ['<rootDir>/tests/testSetup.js'],
  moduleNameMapper: {
    '\\.(css|png|jpg|jpeg|gif|svg)$': 'identity-obj-proxy'
  },
  transform: {
    // Use babel-jest to transform JS/JSX/TS/TSX
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
};
