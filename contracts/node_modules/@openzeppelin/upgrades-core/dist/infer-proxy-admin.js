"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferProxyAdmin = inferProxyAdmin;
const call_optional_signature_1 = require("./call-optional-signature");
const address_1 = require("./utils/address");
/**
 * Infers whether the address might be a ProxyAdmin contract, by checking if it has an owner() function that returns an address.
 * @param provider Ethereum provider
 * @param possibleContractAddress The address to check
 * @returns true if the address might be a ProxyAdmin contract, false otherwise
 */
async function inferProxyAdmin(provider, possibleContractAddress) {
    const owner = await (0, call_optional_signature_1.callOptionalSignature)(provider, possibleContractAddress, 'owner()');
    return owner !== undefined && (0, address_1.parseAddress)(owner) !== undefined;
}
//# sourceMappingURL=infer-proxy-admin.js.map