# Security Policy

## Supported Versions

The following table outlines the security support status for components in this repository:

| Component | Version / Environment | Supported |
|---|---|---|
| Frontend | `main` branch (latest production deployment on GitHub Pages) | :white_check_mark: |
| Smart Contracts | Current deployments listed in [Deployments.md](Deployments.md) / `main` branch | :white_check_mark: |
| Smart Contracts | Legacy v1 deployments (Ethereum Classic, Polygon) | :x: |

> **Note:** Mainnet v1 deployments run the legacy contract ABI before the messaging key registry and hash-based invoice storage changes (see [Deployments.md](Deployments.md)). Only the latest contract code and current Sepolia deployment matching this repository's ABI receive active security consideration.

## Scope

- **Frontend (`frontend/`):** React/Vite web application, client-side cryptographic handling (ECIES encryption, key derivation, and invoice hashing), and web security standards.
- **Smart Contracts (`contracts/`):** Solidity smart contracts managing invoice data commitments and public key registrations.
- **Out of Scope:** Third-party RPC providers, external wallet software, or vulnerabilities originating from unsupported legacy deployments.

## Reporting a Vulnerability

If you discover a security vulnerability in Chainvoice, please report it privately rather than opening a public issue or discussing it in public channels.

- **Preferred Route (once enabled):** GitHub's Private Vulnerability Reporting:  
  [Report a vulnerability](https://github.com/StabilityNexus/Chainvoice/security/advisories/new)  
  *(Note: This route requires repository maintainers to enable Private Vulnerability Reporting in repository settings.)*

- **Current Direct Contact:** You can reach out directly and privately to the maintainers:
  - Maintainer: Atharva Naik ([@Atharva0506](https://github.com/Atharva0506)) via direct message on Discord (Stability Nexus Discord server). Please do not post vulnerability details in public channels.
  <!-- Maintainers: please configure an official security contact email if desired (e.g., security@stability.nexus) -->

Please provide:
- A description of the issue and potential impact
- Steps to reproduce or a proof of concept
- Any potential remediations if known

## What to Expect

- **Acknowledgement & Triage:** Reports are reviewed by project maintainers on a best-effort basis. No formal response timeline or SLA is guaranteed.
- **Remediation & Disclosure:** Validated vulnerabilities will be addressed in a coordinated manner, with fixes published alongside a GitHub Security Advisory where appropriate.

Chainvoice is an open-source project and does not currently offer a paid bug bounty program or formal audit-backed guarantees.


## Known Dependency Advisories (Accepted Risk)

`npm audit` in `frontend/` still reports six high-severity findings. They come from two separate dependency chains, and the maintainers have decided to document them here instead of fixing them now. Neither chain runs in the shipped site, and neither has a fix that can be applied without a major migration.

**Measured on 2026-10-13** against `main` (`428e94eb`), with the dependency tree resolved freshly. The frontend lockfile is not tracked (`frontend/package-lock.json` is gitignored), so a clean install resolves the newest versions `package.json` allows. These numbers drift as versions and advisories are published.

To re-measure, resolve in an empty directory. Running `npm install` in `frontend/` is not enough: npm reuses an existing `package-lock.json` or `node_modules` while their versions still satisfy `package.json`, and it does so even with `--package-lock-only` and even after deleting only the lockfile, so the counts come out stale.

```sh
tmp=$(mktemp -d) && cp frontend/package.json "$tmp" && cd "$tmp" && npm install --package-lock-only
npm audit
npm audit --omit=dev
```

Deleting both `frontend/node_modules` and `frontend/package-lock.json` before running `npm install --package-lock-only` in place gives the same result.

| Command | Total | Low | Moderate | High | Critical |
|---|---|---|---|---|---|
| `npm audit` | 56 | 6 | 44 | 6 | 0 |
| `npm audit --omit=dev` | 31 | 0 | 25 | 6 | 0 |

The critical `jspdf` finding was fixed by upgrading to 4.2.1 (#270). The high findings are `tailwindcss`, `chokidar`, `fast-glob`, `micromatch` and `braces` (one chain), and `ws` (the other).

### tailwindcss 3.4.19 and its glob chain

**Finding.** `braces` is vulnerable to stack exhaustion through deeply nested patterns ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), affects `<= 3.0.3`). `micromatch`, `fast-glob`, `chokidar` and `tailwindcss` are flagged only because they depend on it: `tailwindcss` 3.4.19 requires `chokidar` ^3.6.0, `fast-glob` ^3.3.2 and `micromatch` ^4.0.8; `chokidar` requires `braces` ~3.0.2, `micromatch` requires `braces` ^3.0.3, and `fast-glob` depends on `micromatch`.

**Why it is accepted.**

- **Build time only.** Tailwind runs inside PostCSS while Vite builds the CSS (`postcss.config.js`, `tailwind.config.js`, the `@tailwind` directives in `src/index.css`). Nothing in `src/` imports any package in this chain, and the production image serves only the built `dist/`. A search of all 224 JavaScript files in the production build for strings unique to `micromatch`, `fast-glob`, `chokidar`, Tailwind's internals and `postcss-selector-parser` found none. The same search does find strings that must be present, such as `jsPDF`.
- **Trusted input.** The patterns `braces` expands come from the `content` globs in `tailwind.config.js`, which maintainers write. They are not user input.
- **No patched version exists.** `braces` 3.0.3 is both the latest release on npm and the affected version, so no `overrides` entry can reach a fixed one.
- **The only fix is a major migration.** `npm audit` offers `tailwindcss` 4.3.3. Tailwind 4 changes how the config, the CSS entry point and plugins work, and this project uses `tailwindcss/defaultTheme` and `tailwindcss-animate` in `tailwind.config.js` and `@tailwind` directives in `src/index.css`. The migration is deferred until after launch.

**Why it counts as a production dependency.** `package.json` lists `tailwindcss` under `devDependencies`, but `tailwindcss-animate` (a regular dependency) declares it as a peer dependency, so the resolved tree marks `tailwindcss` as non-dev. That is why these findings also appear under `npm audit --omit=dev`.

### ws

**Findings.** [GHSA-58qx-3vcg-4xpx](https://github.com/advisories/GHSA-58qx-3vcg-4xpx) (Moderate: uninitialized memory disclosure, fixed in 8.20.1) and [GHSA-96hv-2xvq-fx4p](https://github.com/advisories/GHSA-96hv-2xvq-fx4p) (High: memory exhaustion from tiny fragments, fixed in 8.21.0). Only the second is High. `ws` counts once among the six high findings because npm rates a package by its worst advisory.

**Why it is accepted.**

- **The top-level copy is patched.** `ws` 8.21.0 is the version used by `ethers`, `viem` and `engine.io-client`.
- **Only nested copies are affected.** The vulnerable `ws` 8.18.0 copies sit under `@reown/appkit`, `@reown/appkit-controllers`, `@reown/appkit-utils` and `@walletconnect/utils`. An older `viem` 2.23.2 nested there pins `ws` 8.18.0. They arrive through `wagmi` → `@wagmi/connectors` → `@walletconnect/ethereum-provider` → `@reown/appkit`.
- **Unreachable in the bundle.** `ws` is a Node.js library. Its browser entry (`browser.js`) only throws `ws does not work in the browser`, and browsers use the native `WebSocket`. The production bundle contains no `ws` code: no `WebSocketServer`, `permessage-deflate` or `Sec-WebSocket-Key` strings in any of the 224 JavaScript files, and not even the browser stub. The site is static and has no Node process that could run it.
- **The suggested fix cannot be applied.** `npm audit` offers `wagmi` 3.x, a major upgrade. The project is held on `wagmi` 2.x because the wallet-connection package it builds on declares `wagmi` 2 as a peer dependency: `@rainbow-me/rainbowkit` 2.x declares `^2.9.0` (latest 2.2.11), and `@stability-nexus/walletlink`, which #272 switches to, declares `^2`. Whichever of the two is in use, the project cannot take `wagmi` 3 until that package supports it. The project currently declares `wagmi` ^2.14.8.

### Revisiting these

Remove an entry once its fix lands: the Tailwind 4 migration, or the project moving to `wagmi` 3, which needs a wallet-connection package that supports it (neither RainbowKit 2.x nor WalletLink does today). Treat the assessment as void if any of these packages starts being imported by code that runs in the browser or handles untrusted input.
