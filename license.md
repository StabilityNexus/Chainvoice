This PR updates the StablePay SDK to support the Ethereum Classic (ETC) Mainnet and renames the existing Ethereum Classic testnet configuration to "Mordor Testnet" for better clarity and standardization. It addresses Issue #18.
Fixes #18

Changes Made:

Renamed Network: Changed the existing ethereum-classic configuration key and display name to mordor-testnet.

Added Network: Added a new configuration entry for ethereum-classic with the following details:

Chain ID: 61

RPC: https://etc.rivet.link

Djed Contract: 0xCc3664d7021FD36B1Fe2b136e2324710c8442cCf (Verified via on-chain calls)

Stablecoin (ECSD): 0x5A7Ca94F6E969C94bef4CE5e2f90ed9d4891918A (Verified via Blockscout)
