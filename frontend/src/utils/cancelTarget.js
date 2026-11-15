/**
 * Invoice ids repeat across chains and wallets, so a cancel confirmation only
 * applies to the network and account it was opened on.
 */
export function isCancelTargetCurrent(target, chainId, address) {
  return (
    Boolean(target) &&
    target.chainId === chainId &&
    target.address?.toLowerCase() === address?.toLowerCase()
  );
}
