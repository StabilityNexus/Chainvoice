module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],
  collectCoverageFrom: [
    "src/utils/invoiceCalculations.js",
    "src/utils/invoiceValidation.js",
    "src/services/relay/invoiceCrypto.js",
    "src/services/relay/invoiceHashUtils.js",
    "src/services/relay/relayInvoiceMessaging.js",
  ],
  coverageDirectory: "<rootDir>/coverage",
};
