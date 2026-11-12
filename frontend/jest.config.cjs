
module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],

  globalSetup: "<rootDir>/tests/setupTimezone.cjs",

  transform: {
    "^.+\\.jsx$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "ecmascript",
            jsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
          target: "es2022",
        },
        module: {
          type: "es6",
        },
      },
    ],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  collectCoverageFrom: [
    "src/utils/invoiceCalculations.js",
    "src/utils/invoiceValidation.js",
    "src/utils/invoicePagination.js",
    "src/utils/documentMeta.js",
    "src/utils/paymentToken.js",
    "src/services/relay/invoiceCrypto.js",
    "src/services/relay/invoiceHashUtils.js",
    "src/services/relay/relayInvoiceMessaging.js",
    "src/services/relay/relayKeyManager.js",
  ],

  coverageDirectory: "<rootDir>/coverage",
};
