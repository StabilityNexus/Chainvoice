module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],
  collectCoverageFrom: [
    "src/utils/invoiceCalculations.js",
    "src/utils/invoiceValidation.js",
  ],
  coverageDirectory: "<rootDir>/coverage",
};
