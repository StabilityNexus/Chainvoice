# Deployments

All deployments of contracts in this repo, including test/beta versions, are documented in this file.
This file lists the addresses of the contracts that have been deployed
as well as the constructor parameters that have been used.

| Network | Network ID | Version | Contract `Chainvoice.sol` Address | Contract `Chainvoice.sol` Parameters | Comments |
|---|---|---|---|---|---|
| Ethereum Classic | 61 | [v1](https://github.com/StabilityNexus/Chainvoice/releases/tag/v1) | `0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Mainnet |
| Polygon | 137 | [v1](https://github.com/StabilityNexus/Chainvoice/releases/tag/v1) | `0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Mainnet |
| Ethereum Sepolia | 11155111 | [v1](https://github.com/StabilityNexus/Chainvoice/releases/tag/v1) | `0x54a542dCDC306eE281b5De4613EcEfe6e6ABc562` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Testnet |
| Ethereum Sepolia | 11155111 | Public key registry (`registerPublicKey` / `getPublicKey`), hash-based invoice storage | `0x65eb0ca96f972c5a0cdaa623a5b54650e499df5b` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Testnet. Current deployment the frontend targets. |

> ⚠️ **The v1 rows are incompatible with the current contract.** The key registry
> functions were renamed (`registerPublicKey` / `getPublicKey`), which changed
> their selectors, and invoice payloads moved off-chain behind a `bytes32` hash.
> Only the Sepolia row above marked as the current deployment matches the ABI in
> this repo. Ethereum Classic and Polygon still run v1 and need redeploying
> before those networks can be enabled.

---
**Note to Developers:** After making a new deployment, please:
1. create a git tag for the deployed version;
2. add a new row to the table above with the details of the deployment.
