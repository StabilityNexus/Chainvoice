"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationErrorUnsafeMessages = exports.silenceWarnings = void 0;
exports.withValidationDefaults = withValidationDefaults;
exports.processExceptions = processExceptions;
const run_1 = require("./run");
const log_1 = require("../utils/log");
const report_1 = require("./report");
// Backwards compatibility
var log_2 = require("../utils/log");
Object.defineProperty(exports, "silenceWarnings", { enumerable: true, get: function () { return log_2.silenceWarnings; } });
/**
 * Warnings to display when a validation error occurs but is allowed.
 * `null` indicates that the original message should be displayed.
 */
exports.ValidationErrorUnsafeMessages = {
    'state-variable-assignment': [
        `You are using the \`unsafeAllow.state-variable-assignment\` flag.`,
        `The value will be stored in the implementation and not the proxy.`,
    ],
    'state-variable-immutable': [`You are using the \`unsafeAllow.state-variable-immutable\` flag.`],
    'external-library-linking': [
        `You are using the \`unsafeAllow.external-library-linking\` flag to include external libraries.`,
        `Make sure you have manually checked that the linked libraries are upgrade safe.`,
    ],
    'struct-definition': [
        `You are using the \`unsafeAllow.struct-definition\` flag to skip storage checks for structs.`,
        `Make sure you have manually checked the storage layout for incompatibilities.`,
    ],
    'enum-definition': [
        `You are using the \`unsafeAllow.enum-definition\` flag to skip storage checks for enums.`,
        `Make sure you have manually checked the storage layout for incompatibilities.`,
    ],
    constructor: [`You are using the \`unsafeAllow.constructor\` flag.`],
    delegatecall: [`You are using the \`unsafeAllow.delegatecall\` flag.`],
    selfdestruct: [`You are using the \`unsafeAllow.selfdestruct\` flag.`],
    'missing-public-upgradeto': [
        `You are using the \`unsafeAllow.missing-public-upgradeto\` flag with uups proxy.`,
        `Not having a public upgradeTo or upgradeToAndCall function in your implementation can break upgradeability.`,
        `Some implementation might check that onchain, and cause the upgrade to revert.`,
    ],
    'internal-function-storage': [
        `You are using the \`unsafeAllow.internal-function-storage\` flag.`,
        `Internal functions are code pointers which will no longer be valid after an upgrade.`,
        `Make sure you reassign internal functions in storage variables during upgrades.`,
    ],
    'missing-initializer': [
        `You are using the \`unsafeAllow.missing-initializer\` flag.`,
        `Make sure you have manually checked that the contract has an initializer and that it correctly calls all parent initializers.`,
    ],
    'missing-initializer-call': [
        `You are using the \`unsafeAllow.missing-initializer-call\` flag.`,
        `Make sure you have manually checked that the contract initializer calls all parent initializers.`,
    ],
    'duplicate-initializer-call': [
        `You are using the \`unsafeAllow.duplicate-initializer-call\` flag.`,
        `Make sure you have manually checked that the contract initializer calls each parent initializer only once.`,
    ],
    'incorrect-initializer-order': null,
};
function withValidationDefaults(opts) {
    const unsafeAllow = opts.unsafeAllow ?? [];
    const unsafeAllowCustomTypes = opts.unsafeAllowCustomTypes ??
        (unsafeAllow.includes('struct-definition') && unsafeAllow.includes('enum-definition'));
    const unsafeAllowLinkedLibraries = opts.unsafeAllowLinkedLibraries ?? unsafeAllow.includes('external-library-linking');
    if (unsafeAllowCustomTypes) {
        unsafeAllow.push('enum-definition', 'struct-definition');
    }
    if (unsafeAllowLinkedLibraries) {
        unsafeAllow.push('external-library-linking');
    }
    const kind = opts.kind ?? 'transparent';
    const unsafeAllowRenames = opts.unsafeAllowRenames ?? false;
    const unsafeSkipStorageCheck = opts.unsafeSkipStorageCheck ?? false;
    return {
        unsafeAllowCustomTypes,
        unsafeAllowLinkedLibraries,
        unsafeAllowRenames,
        unsafeSkipStorageCheck,
        unsafeAllow,
        kind,
    };
}
function processExceptions(contractName, errors, opts) {
    const { unsafeAllow } = withValidationDefaults(opts);
    if (opts.kind === 'transparent' || opts.kind === 'beacon') {
        errors = errors.filter(error => error.kind !== 'missing-public-upgradeto');
    }
    for (const [key, errorDescription] of Object.entries(exports.ValidationErrorUnsafeMessages)) {
        const errorType = key;
        const skip = unsafeAllow.includes(errorType);
        const warn = run_1.convertToWarnings.includes(errorType);
        if (skip || warn) {
            const errorsWithType = errors.filter(error => error.kind === errorType);
            errors = errors.filter(error => !errorsWithType.includes(error));
            // Display message about the exception, unless it is a warning that the user has chosen to skip
            if (errorsWithType.length > 0 && !(skip && warn)) {
                if (errorDescription !== null) {
                    (0, log_1.logWarning)(`Potentially unsafe deployment of ${contractName}`, errorDescription);
                }
                else {
                    for (const error of errorsWithType) {
                        (0, log_1.logWarning)(`Potentially unsafe deployment of ${contractName}`, [(0, report_1.describeError)(error)]);
                    }
                }
            }
        }
    }
    return errors;
}
//# sourceMappingURL=overrides.js.map