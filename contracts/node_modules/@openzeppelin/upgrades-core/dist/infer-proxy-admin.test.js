"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const infer_proxy_admin_1 = require("./infer-proxy-admin");
const addr = '0x123';
function makeProviderReturning(result) {
    return { send: (_method, _params) => Promise.resolve(result) };
}
function makeProviderError(msg) {
    return {
        send: (_method, _params) => {
            throw new Error(msg);
        },
    };
}
(0, ava_1.default)('inferProxyAdmin returns true when owner looks like an address', async (t) => {
    // abi encoding of address 0x1000000000000000000000000000000000000123
    const provider = makeProviderReturning('0x0000000000000000000000001000000000000000000000000000000000000123');
    t.true(await (0, infer_proxy_admin_1.inferProxyAdmin)(provider, addr));
});
(0, ava_1.default)('inferProxyAdmin returns false when returned value is 32 bytes but clearly not an address', async (t) => {
    // dirty upper bits beyond 20 bytes (the 'abc' in the below)
    const provider = makeProviderReturning('0x000000000000000000000abc1000000000000000000000000000000000000123');
    t.false(await (0, infer_proxy_admin_1.inferProxyAdmin)(provider, addr));
});
(0, ava_1.default)('inferProxyAdmin returns false when returned value is a string', async (t) => {
    // abi encoding of string 'foo'
    const provider = makeProviderReturning('0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003666f6f0000000000000000000000000000000000000000000000000000000000');
    t.false(await (0, infer_proxy_admin_1.inferProxyAdmin)(provider, addr));
});
(0, ava_1.default)('inferProxyAdmin throws unrelated error', async (t) => {
    const provider = makeProviderError('unrelated error');
    await t.throwsAsync(() => (0, infer_proxy_admin_1.inferProxyAdmin)(provider, addr), { message: 'unrelated error' });
});
(0, ava_1.default)('inferProxyAdmin returns false for invalid selector', async (t) => {
    const provider = makeProviderError(`Transaction reverted: function selector was not recognized and there's no fallback function`);
    t.false(await (0, infer_proxy_admin_1.inferProxyAdmin)(provider, addr));
});
//# sourceMappingURL=infer-proxy-admin.test.js.map