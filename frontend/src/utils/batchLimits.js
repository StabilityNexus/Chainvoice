// Mirrors MAX_CREATE_BATCH in Chainvoice.sol, which is the real guard: a larger
// batch reverts with InvalidBatchSize. It is sized so a full batch fits in one
// Ethereum Classic block (8M gas).
export const MAX_INVOICES_PER_BATCH = 30;

// Chains where a full contract-size batch can't be mined. Sepolia charges about
// 0.9M gas per stored invoice (measured with eth_estimateGas: 15 invoices 13.6M,
// 18 invoices 16.3M) against a 16.78M per-transaction gas cap, so 15 leaves
// room for the gas buffer wallets add on top of the estimate.
const CHAIN_MAX_INVOICES_PER_BATCH = {
  11155111: 15,
};

export function getMaxInvoicesPerBatch(chainId) {
  return CHAIN_MAX_INVOICES_PER_BATCH[Number(chainId)] ?? MAX_INVOICES_PER_BATCH;
}
