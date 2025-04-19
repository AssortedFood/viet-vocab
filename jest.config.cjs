// jest.config.cjs
module.exports = {
    roots: ['<rootDir>/tests'],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/testSetup.js'],
    moduleNameMapper: {
      // Mock static asset imports
      '\\.(css|png|jpg|jpeg|gif|svg)$': 'identity-obj-proxy'
    },
    transform: {
      // Handle JS/JSX/TS/TSX via babel-jest
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  };
  