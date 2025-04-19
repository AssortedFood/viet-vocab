// jest.config.cjs
module.exports = {
  roots: ["<rootDir>/tests"],
  testEnvironment: "jest-environment-jsdom",

  // Polyfill fetch for OpenAI
  setupFiles: ["openai/shims/node"],
  setupFilesAfterEnv: ["<rootDir>/tests/testSetup.js"],

  // Stub out static assets
  moduleNameMapper: {
    "\\.(css|png|jpe?g|gif|svg)$": "identity-obj-proxy"
  },

  // Use SWC to transform everything, with JSX support
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "ecmascript",
            jsx: true,
            dynamicImport: true
          },
          transform: {
            react: {
              runtime: "automatic",
              development: process.env.NODE_ENV !== "production",
              useBuiltins: true
            }
          }
        },
        module: {
          type: "commonjs"
        }
      }
    ]
  },

  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
};
