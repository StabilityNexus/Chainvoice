import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { AbiCoder, Contract, JsonRpcProvider } from "ethers";
import { chainConfig } from "../../src/utils/chainConfig.js";
import { verifyTokenContract } from "../../src/utils/paymentToken.js";
import {
  CHAIN_ID_TO_PUBLIC_RPC,
  createTokenReadProvider,
  getCheckedTokenReadProvider,
  getTokenReadProvider,
  TOKEN_READ_TIMEOUT_MS,
  tokenRpcErrorState,
  TokenRpcUnavailableError,
  TokenRpcWrongNetworkError,
} from "../../src/utils/tokenReadProvider.js";

const en = JSON.parse(
  readFileSync(new URL("../../src/locales/en.json", import.meta.url), "utf8")
);

const TOKEN = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

function injectOtherWallet() {
  const request = jest.fn();
  globalThis.window = { ethereum: { request } };
  return request;
}

describe("getTokenReadProvider", () => {
  afterEach(() => {
    delete globalThis.window;
  });

  test("pins the given chain and ignores an injected wallet", async () => {
    const otherWallet = injectOtherWallet();
    const provider = getTokenReadProvider(11155111);

    expect(provider).toBeInstanceOf(JsonRpcProvider);
    expect(provider._getConnection().url).toBe(CHAIN_ID_TO_PUBLIC_RPC[11155111]);
    expect((await provider.getNetwork()).chainId).toBe(11155111n);
    expect(otherWallet).not.toHaveBeenCalled();
    provider.destroy();
  });

  test("reads a chain id given as a string with no wallet", async () => {
    expect(globalThis.window).toBeUndefined();
    const provider = getTokenReadProvider("137");

    expect(provider._getConnection().url).toBe(CHAIN_ID_TO_PUBLIC_RPC[137]);
    expect((await provider.getNetwork()).chainId).toBe(137n);
    provider.destroy();
  });

  test("returns nothing for a chain with no RPC even with an injected wallet", () => {
    const otherWallet = injectOtherWallet();

    for (const chainId of [undefined, null, "", 0, -1, "abc", 1.5, 31337]) {
      expect(getTokenReadProvider(chainId)).toBeNull();
    }
    expect(otherWallet).not.toHaveBeenCalled();
  });

  test("has a public RPC for every chain the app is configured for", () => {
    for (const chain of chainConfig) {
      expect(CHAIN_ID_TO_PUBLIC_RPC[chain.id]).toMatch(/^https:\/\//);
    }
  });

  test("en.json has the token messages both pages show", () => {
    expect(en.createInvoice.tokenNetworkUnsupported).toEqual(expect.any(String));
    expect(en.batchInvoice.errors.connectToVerify).toEqual(expect.any(String));
    expect(en.batchInvoice.errors.tokenVerifyFailed).toEqual(expect.any(String));
    expect(en.createInvoice.tokenRpcWrongNetwork).toEqual(expect.any(String));
    expect(en.batchInvoice.errors.tokenRpcWrongNetwork).toEqual(expect.any(String));
    expect(en.createInvoice.tokenRpcUnavailable).toEqual(expect.any(String));
    expect(en.batchInvoice.errors.tokenRpcUnavailable).toEqual(expect.any(String));
  });

  test("gives every public RPC read the token read deadline", () => {
    const provider = getTokenReadProvider(1);

    expect(TOKEN_READ_TIMEOUT_MS).toBeLessThanOrEqual(15000);
    expect(provider._getConnection().timeout).toBe(TOKEN_READ_TIMEOUT_MS);
    provider.destroy();
  });
});

describe("getCheckedTokenReadProvider", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function stubChainIdAnswer(answer) {
    return jest.spyOn(JsonRpcProvider.prototype, "send").mockImplementation(answer);
  }

  test("returns the provider when the RPC serves the chain it was asked for", async () => {
    const send = stubChainIdAnswer(async () => "0xaa36a7");

    const provider = await getCheckedTokenReadProvider("11155111");

    expect(send).toHaveBeenCalledWith("eth_chainId", []);
    expect(provider).toBeInstanceOf(JsonRpcProvider);
    provider.destroy();
  });

  test("rejects with TokenRpcWrongNetworkError when the RPC serves another chain", async () => {
    stubChainIdAnswer(async () => "0x1");

    await expect(getCheckedTokenReadProvider(11155111)).rejects.toBeInstanceOf(
      TokenRpcWrongNetworkError
    );
  });

  test("reports a failed chain id check as an unavailable RPC, not a bad token", async () => {
    const down = new Error("missing response");
    stubChainIdAnswer(async () => {
      throw down;
    });

    const error = await getCheckedTokenReadProvider(137).catch((e) => e);
    expect(error).toBeInstanceOf(TokenRpcUnavailableError);
    expect(error.cause).toBe(down);
  });

  test("keeps a deadline error from the RPC as it is", async () => {
    const timedOut = new TokenRpcUnavailableError(137, new Error("aborted"));
    stubChainIdAnswer(async () => {
      throw timedOut;
    });

    await expect(getCheckedTokenReadProvider(137)).rejects.toBe(timedOut);
  });

  test("returns null for a chain with no RPC without calling the network", async () => {
    const send = stubChainIdAnswer(async () => "0x1");

    await expect(getCheckedTokenReadProvider(31337)).resolves.toBeNull();
    expect(send).not.toHaveBeenCalled();
  });
});

describe("createTokenReadProvider deadline", () => {
  const servers = [];

  afterEach(async () => {
    await Promise.all(servers.splice(0).map((server) => {
      server.closeAllConnections();
      return new Promise((resolve) => server.close(resolve));
    }));
  });

  // A local RPC whose handler decides how (or whether) it answers.
  async function startRpc(handler) {
    const closed = [];
    const server = createServer((req, res) => {
      req.on("close", () => closed.push(Date.now()));
      handler(req, res);
    });
    servers.push(server);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    return { url: `http://127.0.0.1:${server.address().port}`, closed };
  }

  test("reads through a working RPC", async () => {
    const rpc = await startRpc((req, res) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const { id } = JSON.parse(body);
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ jsonrpc: "2.0", id, result: "0x1" }));
      });
    });
    const provider = createTokenReadProvider(rpc.url, 1, 1000);

    await expect(provider.send("eth_chainId", [])).resolves.toBe("0x1");
    provider.destroy();
  });

  test("gives up on an RPC that never answers and cancels the request", async () => {
    const rpc = await startRpc(() => {});
    const provider = createTokenReadProvider(rpc.url, 1, 150);
    const started = Date.now();

    await expect(provider.send("eth_chainId", [])).rejects.toBeInstanceOf(
      TokenRpcUnavailableError
    );
    expect(Date.now() - started).toBeLessThan(2000);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(rpc.closed).toHaveLength(1);
    provider.destroy();
  });

  test("does not retry a rate limited RPC past the deadline", async () => {
    let requests = 0;
    const rpc = await startRpc((req, res) => {
      requests += 1;
      if (requests === 1) {
        res.writeHead(429, { "retry-after": "1" });
        res.end();
      }
    });
    const provider = createTokenReadProvider(rpc.url, 1, 150);
    const started = Date.now();

    await expect(provider.send("eth_chainId", [])).rejects.toBeInstanceOf(
      TokenRpcUnavailableError
    );
    expect(Date.now() - started).toBeLessThan(500);
    expect(requests).toBe(1);
    provider.destroy();
  });

  test("calls a failed token read an RPC problem after a good chain id check", async () => {
    const rpc = await startRpc((req, res) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const calls = [].concat(JSON.parse(body));
        if (calls.some((call) => call.method === "eth_call")) {
          res.writeHead(503);
          res.end("Service Unavailable");
          return;
        }
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(calls.map(({ id }) => ({ jsonrpc: "2.0", id, result: "0x1" }))));
      });
    });
    const provider = createTokenReadProvider(rpc.url, 1, 1000);
    const token = new Contract(TOKEN, ["function decimals() view returns (uint8)"], provider);

    await expect(provider.send("eth_chainId", [])).resolves.toBe("0x1");
    const error = await token.decimals().catch((e) => e);
    expect(tokenRpcErrorState(error)).toBe("rpc-unavailable");
    provider.destroy();
  });

  // A local RPC that rate limits (JSON-RPC -32005) only the reads whose call data is in `limited`.
  async function startLimitedRpc(limited) {
    const answers = {
      "0x95d89b41": abiString("USDC"), // symbol()
      "0x06fdde03": abiString("USD Coin"), // name()
      "0x313ce567": "0x" + "6".padStart(64, "0"), // decimals()
    };
    return startRpc((req, res) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const calls = [].concat(JSON.parse(body));
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(calls.map(({ id, params }) => {
          const data = params?.[0]?.data;
          return limited.includes(data)
            ? { jsonrpc: "2.0", id, error: { code: -32005, message: "limit exceeded" } }
            : { jsonrpc: "2.0", id, result: answers[data] };
        })));
      });
    });
  }

  function abiString(text) {
    return AbiCoder.defaultAbiCoder().encode(["string"], [text]);
  }

  const ERC20_READS = [
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
  ];

  test("calls a JSON-RPC rate limit an RPC problem only for the read it hit", async () => {
    const rpc = await startLimitedRpc(["0x95d89b41"]);
    const provider = createTokenReadProvider(rpc.url, 1, 1000);
    const token = new Contract(TOKEN, ERC20_READS, provider);

    const [symbol, decimals] = await Promise.allSettled([token.symbol(), token.decimals()]);
    expect(symbol.status).toBe("rejected");
    expect(tokenRpcErrorState(symbol.reason)).toBe("rpc-unavailable");
    expect(decimals).toEqual({ status: "fulfilled", value: 6n });
    provider.destroy();
  });

  test("still verifies a token when only its optional name is rate limited", async () => {
    const rpc = await startLimitedRpc(["0x06fdde03"]);
    const provider = createTokenReadProvider(rpc.url, 1, 1000);
    const token = await verifyTokenContract({
      contract: new Contract(TOKEN, ERC20_READS, provider),
      address: TOKEN,
      setVerifiedToken: () => {},
      setTokenVerificationState: () => {},
    });

    expect(token).toMatchObject({ symbol: "USDC", name: "Unknown Token", decimals: 6 });
    provider.destroy();
  });

  test("still calls a token that reverts a token problem", async () => {
    const rpc = await startRpc((req, res) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const calls = [].concat(JSON.parse(body));
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(calls.map(({ id }) => ({
          jsonrpc: "2.0",
          id,
          error: { code: 3, message: "execution reverted", data: "0x" },
        }))));
      });
    });
    const provider = createTokenReadProvider(rpc.url, 1, 1000);
    const token = new Contract(TOKEN, ["function decimals() view returns (uint8)"], provider);

    const error = await token.decimals().catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(tokenRpcErrorState(error)).toBe("error");
    provider.destroy();
  });

  test("gives up on an RPC that stops in the middle of its answer", async () => {
    const rpc = await startRpc((req, res) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.write('{"jsonrpc":"2.0",');
    });
    const provider = createTokenReadProvider(rpc.url, 1, 150);

    await expect(provider.send("eth_chainId", [])).rejects.toBeInstanceOf(
      TokenRpcUnavailableError
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(rpc.closed).toHaveLength(1);
    provider.destroy();
  });
});

describe("tokenRpcErrorState", () => {
  test("names the RPC problem so the pages do not blame the token", () => {
    expect(tokenRpcErrorState(new TokenRpcWrongNetworkError(1, 5n))).toBe("rpc-wrong-network");
    expect(tokenRpcErrorState(new TokenRpcUnavailableError(1))).toBe("rpc-unavailable");
    expect(tokenRpcErrorState(new Error("could not decode result data"))).toBe("error");
  });
});
