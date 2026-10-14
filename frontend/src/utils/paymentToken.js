import { ZeroAddress } from "ethers";

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
