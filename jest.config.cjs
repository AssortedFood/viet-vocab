// jest.config.cjs
module.exports = {
  roots: ['<rootDir>/tests'],
  testEnvironment: 'jest-environment-jsdom',
  // Run this before anything else—so fetch gets polyfilled for OpenAI
  setupFiles: ['openai/shims/node'],
  // Then do your other test setup
  setupFilesAfterEnv: ['<rootDir>/tests/testSetup.js'],
  moduleNameMapper: {
    '\\.(css|png|jpg|jpeg|gif|svg)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
};
