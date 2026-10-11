# Security Policy

## Supported Versions

The following table outlines the security support status for components in this repository:

| Component | Version / Environment | Supported |
|---|---|---|
| Frontend | `main` branch (latest production deployment on GitHub Pages) | :white_check_mark: |
| Smart Contracts | Current deployment on Ethereum Sepolia (`0x65eb0ca96f972c5a0cdaa623a5b54650e499df5b`) / `main` branch | :white_check_mark: |
| Smart Contracts | Legacy v1 deployments (Ethereum Classic, Polygon) | :x: |

> **Note:** Mainnet v1 deployments run the legacy contract ABI before the messaging key registry and hash-based invoice storage changes (see [Deployments.md](Deployments.md)). Only the latest contract code and current Sepolia deployment matching this repository's ABI receive active security consideration.

## Scope

- **Frontend (`frontend/`):** React/Vite web application, client-side cryptographic handling (ECIES encryption, key derivation, and invoice hashing), and web security standards.
- **Smart Contracts (`contracts/`):** Solidity smart contracts managing invoice data commitments and public key registrations.
- **Out of Scope:** Third-party RPC providers, external wallet software, or vulnerabilities originating from unsupported legacy deployments.

## Reporting a Vulnerability

If you discover a security vulnerability in Chainvoice, please report it privately rather than opening a public issue or discussing it in public channels.

- **Preferred Method:** Submit a private report through GitHub's Private Vulnerability Reporting:  
  [Report a vulnerability](https://github.com/StabilityNexus/Chainvoice/security/advisories/new)

- **Alternative Contact:** If you are unable to use GitHub's private reporting tool, you can reach out to the maintainers:
  <!-- Maintainers: please configure an official security contact email if desired (e.g., security@stability.nexus) -->
  - Maintainer: Atharva Naik ([@Atharva0506](https://github.com/Atharva0506)) via the [#chainvoice channel](https://discord.com/channels/995968619034984528/1328282666335993856) on the Stability Nexus Discord server

Please provide:
- A description of the issue and potential impact
- Steps to reproduce or a proof of concept
- Any potential remediations if known

## What to Expect

- **Acknowledgement & Triage:** Reports are reviewed by project maintainers on a best-effort basis. No formal response timeline or SLA is guaranteed.
- **Remediation & Disclosure:** Validated vulnerabilities will be addressed in a coordinated manner, with fixes published alongside a GitHub Security Advisory where appropriate.

Chainvoice is an open-source project and does not currently offer a paid bug bounty program or formal audit-backed guarantees.
