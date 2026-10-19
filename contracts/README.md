## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
# Sepolia charges more gas for deployed code than forge simulates
$ forge script script/Chainvoice.s.sol:DeployChainvoice --rpc-url sepolia --account deployer --broadcast --gas-estimate-multiplier 800

# Ethereum Classic has no EIP-1559, so it needs --legacy
$ forge script script/Chainvoice.s.sol:DeployChainvoice --rpc-url etc --account deployer --broadcast --legacy
```

### Cast

```shell
$ cast <subcommand>
```

## Chainvoice contract reference

`src/Chainvoice.sol` has no owner and is not upgradeable. Amounts are in the
token's smallest unit; `tokenAddress` `0x0` means the chain's native coin. Every
paid invoice also costs `devFee` in the native coin.

### Invoices

| Function | Who can call | What it does |
| --- | --- | --- |
| `createInvoice(to, amountDue, tokenAddress, invoiceDataHash)` | anyone | Creates one invoice to `to`. Reverts for a zero address, self-invoicing, a zero amount or hash, or a token that isn't an ERC-20 contract. |
| `createInvoicesBatch(tos, amountsDue, tokenAddress, invoiceDataHashes)` | anyone | Creates up to `MAX_CREATE_BATCH` (30) invoices in one token, same checks per invoice. |
| `cancelInvoice(invoiceId)` | the invoice's sender | Cancels an unpaid invoice. |
| `payInvoice(invoiceId)` | the invoice's recipient | Native: send `amountDue + devFee`. ERC-20: approve `amountDue`, send `devFee`. The value must match exactly. |
| `payInvoicesBatch(invoiceIds)` | the recipient of every invoice | Pays up to `MAX_BATCH` (50) invoices in one token, all or nothing; the fee is `devFee` per invoice. |

### Views

| Function | Returns |
| --- | --- |
| `getInvoice(invoiceId)` | One invoice. |
| `getSentInvoices(user, offset, limit)` / `getReceivedInvoices(user, offset, limit)` | A page of invoices, newest first (`limit` 1 to 50), and the total. |
| `getPaymentStatus(invoiceId, payer)` | Whether `payer` can pay now, their balance and allowance. |
| `getPublicKey(user)` | The user's registered messaging key, empty if none. |

### Messaging keys

| Function | Who can call | What it does |
| --- | --- | --- |
| `registerPublicKey(publicKey)` | anyone | Stores the caller's 65-byte uncompressed secp256k1 key, used to encrypt invoice details for them. |

### Fees

`dev`, `devFee` and `devFeeReceiver` are set by the constructor.

| Function | Who can call | What it does |
| --- | --- | --- |
| `setDevFee(newDevFee)` | `dev` | Changes the fee for future payments (no cap; 0 allowed). |
| `setDevFeeReceiver(newDevFeeReceiver)` | `dev` | Changes where withdrawn fees go (not `0x0`). |
| `proposeDev(newDev)` | `dev` | Step 1 of handing the `dev` role over; proposing again replaces the pending address. |
| `cancelDevProposal()` | `dev` | Withdraws a pending proposal. |
| `acceptDev()` | the proposed address | Step 2: becomes `dev`. |
| `withdrawFees()` | anyone | Sends all accrued fees to `devFeeReceiver`. |

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
