import { ZeroAddress } from "ethers";

export function validateTokenDecimals(decimals) {
  if (
    typeof decimals !== "number" &&
    typeof decimals !== "string"
  ) {
    throw new Error(
      `Unsupported ERC-20 decimals value: ${decimals}`
    );
  }

  if (
    typeof decimals === "string" &&
    decimals.trim() === ""
  ) {
    throw new Error(
      "Token decimals cannot be empty"
    );
  }

  const value = Number(decimals);

  if (
    !Number.isInteger(value) ||
    value < 0 ||
    value > 80
  ) {
    throw new Error(
      `Unsupported ERC-20 decimals value: ${decimals}`
    );
  }

  return value;
}

export function getNativeToken(chain) {
  if (!chain?.nativeCurrency) return null;
  return {
    ...chain.nativeCurrency,
    address: ZeroAddress,
    contract_address: ZeroAddress,
  };
}

export async function resolveTokenDecimals(
  tokenAddress,
  fallbackDecimals,
  nativeCurrency,
  readDecimals
) {
  if (tokenAddress?.toLowerCase() === ZeroAddress) {
    return nativeCurrency?.decimals ?? null;
  }
  if (
    fallbackDecimals !== undefined &&
    fallbackDecimals !== null &&
    !Number.isNaN(Number(fallbackDecimals))
  ) {
    return Number(fallbackDecimals);
  }
  return readDecimals();
}

/**
 * The chain a payment link asks for, when that is not the chain in use.
 *
 * Returns null when the link pins no chain or pins the one already in use, so
 * the link can be honoured. Otherwise returns the chain to name to the user:
 * the parsed id, or the raw parameter when it is not a usable chain id.
 */
export function getLinkChainMismatch(urlChainParam, currentChainId) {
  if (!urlChainParam) return null;
  const linkChainId = Number(urlChainParam);
  if (Number.isInteger(linkChainId)) {
    return linkChainId === Number(currentChainId) ? null : { chain: linkChainId };
  }
  return { chain: urlChainParam };
}

/** The configured name of a chain, falling back to its id. */
export function getChainName(chains, chainId) {
  const match = chains?.find((chain) => chain.id === Number(chainId));
  return match?.name ?? String(chainId);
}

export async function verifyTokenContract({
  contract,
  address,
  isCurrent = () => true,
  setVerifiedToken,
  setTokenVerificationState,
}) {
  try {
    const [symbol, name, rawDecimals] = await Promise.all([
      contract.symbol().catch(() => "UNKNOWN"),
      contract.name().catch(() => "Unknown Token"),
      contract.decimals(),
    ]);

    const symbolStr = typeof symbol === "string" ? symbol.trim() : "";

    if (!symbolStr || symbolStr === "UNKNOWN") {
      throw new Error("Unable to read a valid token symbol");
    }

    const decimals = validateTokenDecimals(rawDecimals);

    if (!isCurrent()) return null;

    const token = {
      address,
      symbol: symbolStr,
      name,
      decimals,
    };

    setVerifiedToken(token);
    setTokenVerificationState("success");

    return token;
  } catch (error) {
    if (isCurrent()) {
      setVerifiedToken(null);
      setTokenVerificationState("error");
    }

    throw error;
  }
}