# Deployments

All deployments of contracts in this repo, including test/beta versions, are documented in this file.
This file lists the addresses of the contracts that have been deployed
as well as the constructor parameters that have been used.

| Network | Network ID | Version | Contract `Chainvoice.sol` Address | Contract `Chainvoice.sol` Parameters | Comments |
|---|---|---|---|---|---|
| Ethereum Classic | 61 | [v1](https://github.com/StabilityNexus/Chainvoice/releases/tag/v1) | `0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Mainnet |
| Polygon | 137 | [v1](https://github.com/StabilityNexus/Chainvoice/releases/tag/v1) | `0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Mainnet |
| Ethereum Sepolia | 11155111 | [v1](https://github.com/StabilityNexus/Chainvoice/releases/tag/v1) | `0x54a542dCDC306eE281b5De4613EcEfe6e6ABc562` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Testnet |

---
**Note to Developers:** After making a new deployment, please:
1. create a git tag for the deployed version;
2. add a new row to the table above with the details of the deployment.
