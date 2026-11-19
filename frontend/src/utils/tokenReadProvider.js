import { FetchRequest, JsonRpcProvider } from "ethers";

/** Public RPC URLs by chain ID, so tokens can be read without a wallet. */
export const CHAIN_ID_TO_PUBLIC_RPC = {
  1: "https://ethereum-rpc.publicnode.com",
  61: "https://etc.etcdesktop.com",
  137: "https://polygon-bor-rpc.publicnode.com",
  56: "https://bsc-dataseed.binance.org",
  8453: "https://mainnet.base.org",
  11155111: "https://ethereum-sepolia-rpc.publicnode.com",
  63: "https://0xrpc.io/mordor",
  80002: "https://polygon-amoy.drpc.org",
  5115: "https://rpc.testnet.citrea.xyz",
};

/** Longest wait for one public RPC answer before the token check gives up. */
export const TOKEN_READ_TIMEOUT_MS = 10000;

/** Thrown when a public RPC answers for a different chain than the one asked for. */
export class TokenRpcWrongNetworkError extends Error {
  constructor(expectedChainId, actualChainId) {
    super(`Token RPC serves chain ${actualChainId}, expected ${expectedChainId}`);
    this.name = "TokenRpcWrongNetworkError";
  }
}

/** Thrown when a public RPC fails, is unreachable or does not answer in time. */
export class TokenRpcUnavailableError extends Error {
  constructor(chainId, cause) {
    super(`Token RPC for chain ${chainId} did not answer`, { cause });
    this.name = "TokenRpcUnavailableError";
  }
}

/** EIP-1474 "limit exceeded": a rate limit sent as a JSON-RPC error with HTTP 200. */
const RPC_LIMIT_EXCEEDED = -32005;

/** A JsonRpcProvider that reports a rate limited answer as an RPC failure, per read. */
class TokenReadProvider extends JsonRpcProvider {
  #chainId;

  constructor(request, chainId) {
    super(request, chainId, { staticNetwork: true });
    this.#chainId = chainId;
  }

  getRpcError(payload, response) {
    if (response?.error?.code === RPC_LIMIT_EXCEEDED) {
      return new TokenRpcUnavailableError(this.#chainId, new Error(response.error.message));
    }
    return super.getRpcError(payload, response);
  }
}

/**
 * Sends one RPC request with a single deadline for the headers and the body.
 * ethers stops its own timer once headers arrive, so a stalled body could hang.
 * A non-2xx answer is an RPC failure, which also stops ethers retrying a 429.
 */
function fetchWithDeadline(chainId, timeoutMs) {
  return async (req, signal) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    signal?.addListener(() => controller.abort());
    let resp;
    let body;
    try {
      resp = await fetch(req.url, {
        method: req.method,
        headers: Object.fromEntries(req),
        body: req.body ?? undefined,
        signal: controller.signal,
      });
      body = new Uint8Array(await resp.arrayBuffer());
    } catch (error) {
      throw new TokenRpcUnavailableError(chainId, error);
    } finally {
      clearTimeout(timer);
    }
    if (!resp.ok) {
      throw new TokenRpcUnavailableError(chainId, new Error(`HTTP ${resp.status}`));
    }
    const headers = {};
    resp.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return { statusCode: resp.status, statusMessage: resp.statusText, headers, body };
  };
}

/** A read-only provider for `rpcUrl` pinned to `chainId`, with a deadline on every read. */
export function createTokenReadProvider(rpcUrl, chainId, timeoutMs = TOKEN_READ_TIMEOUT_MS) {
  const request = new FetchRequest(rpcUrl);
  request.timeout = timeoutMs;
  request.getUrlFunc = fetchWithDeadline(chainId, timeoutMs);
  return new TokenReadProvider(request, chainId);
}

/**
 * A read-only provider pinned to `chainId`, or null for an unknown chain.
 * Never window.ethereum, which can be a different wallet or chain than the
 * one the app connected (#348).
 */
export function getTokenReadProvider(chainId) {
  const id = Number(chainId);
  const rpcUrl = CHAIN_ID_TO_PUBLIC_RPC[id];
  return rpcUrl ? createTokenReadProvider(rpcUrl, id) : null;
}

/** getTokenReadProvider after checking the RPC's eth_chainId, which staticNetwork skips. */
export async function getCheckedTokenReadProvider(chainId) {
  const provider = getTokenReadProvider(chainId);
  if (!provider) return null;
  let servedChainId;
  try {
    servedChainId = BigInt(await provider.send("eth_chainId", []));
  } catch (error) {
    provider.destroy();
    throw error instanceof TokenRpcUnavailableError
      ? error
      : new TokenRpcUnavailableError(Number(chainId), error);
  }
  if (servedChainId !== BigInt(Number(chainId))) {
    provider.destroy();
    throw new TokenRpcWrongNetworkError(Number(chainId), servedChainId);
  }
  return provider;
}

/** The page state for a failed token check: an RPC problem, or the token itself. */
export function tokenRpcErrorState(error) {
  if (error instanceof TokenRpcWrongNetworkError) return "rpc-wrong-network";
  if (error instanceof TokenRpcUnavailableError) return "rpc-unavailable";
  return "error";
}
