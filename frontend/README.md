# Chainvoice Frontend

Chainvoice Frontend is the React + Vite user interface for Chainvoice, a decentralized invoicing platform built for secure, transparent, and blockchain-powered invoice creation and payments. It connects users to Web3 wallets, supports multiple EVM networks, and provides the browser experience for creating, sending, receiving, and managing invoices on-chain.

## Prerequisites

Before running the frontend locally, make sure you have:

- **Node.js 18 or newer** installed
- **npm** installed with Node.js
- A **WalletConnect Project ID** from Reown for Web3 wallet connections

## Local Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

1. Install dependencies:

```bash
npm install
```

1. Create your local environment file:

```bash
cp .env.example .env
```

1. Add your WalletConnect Project ID to `.env`:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_reown_project_id
```

1. Start the development server:

```bash
npm run dev
```

The app runs locally at:

```text
http://localhost:5173
```

## Environment Variables

The frontend reads Vite environment variables from `.env`.

The provided `.env.example` lists the contract addresses per network alongside the WalletConnect project ID placeholder:

```env
VITE_CONTRACT_ADDRESS_11155111=0x65eb0ca96f972c5a0cdaa623a5b54650e499df5b
VITE_CONTRACT_ADDRESS_61=
VITE_CONTRACT_ADDRESS_137=
VITE_WALLETCONNECT_PROJECT_ID=
```

> ⚠️ Renaming the key registry functions changed their selectors, so only a
> contract deployed from the current `contracts/src/Chainvoice.sol` will answer.
> The Sepolia address above is such a deployment — see
> [Deployments.md](../Deployments.md). Keys registered against an earlier
> deployment do not carry over; those users must register again.
>
> ⚠️ Ethereum Classic and Polygon are left blank on purpose. Both still run the
> v1 contract, which does not match the current ABI. The app treats any
> non-empty address as supported, so filling these in would send calls those
> contracts cannot decode. Populate them only after redeploying.
### Relay configuration

Invoice payloads travel encrypted over a [ThruBox](https://github.com/AOSSIE-Org/ThruBox-Server) relay, configured with:

```env
VITE_RELAY_URL=http://localhost:3000
VITE_RELAY_API_KEY=
VITE_RELAY_TIMEOUT_MS=
```

- **`VITE_RELAY_URL`** — in development this is the target the Vite dev server proxies `/relay` to, so the browser stays same-origin. In production, either an absolute `https://` URL (which requires CORS on the relay) or a path such as `/relay` that your host rewrites to it (Vercel rewrites, Netlify redirects, nginx `proxy_pass`), which avoids CORS entirely.
- **`VITE_RELAY_API_KEY`** — only needed if the relay sets `security.api_key`. **This is not a secret:** Vite inlines every `VITE_`-prefixed variable into the built JavaScript, so any visitor can read it. Treat it as a spam speed-bump, not access control. To keep a relay key private, proxy relay calls server-side and inject it there.
- **`VITE_RELAY_TIMEOUT_MS`** — request timeout, default `15000`. Raise it (around `60000`) on hosts that suspend idle instances: a cold start can take most of a minute, and sends are deliberately not retried, so a timeout means an undelivered invoice.

To enable Web3 wallet functionality, create a free WalletConnect Project ID from the Reown dashboard:

```text
https://dashboard.reown.com/
```

Then add it to your local `.env` file:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_reown_project_id
```

Do not commit `.env` files to version control.

## Available Scripts

Run these commands from the `frontend/` directory.

### Development

```bash
npm run dev
```

Starts the Vite development server at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Compiles the frontend for production.

### Lint

```bash
npm run lint
```

Runs ESLint checks across the frontend codebase.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for previewing.

## Tech Stack

- React 18
- Vite 6
- RainbowKit
- Wagmi
- Viem
- Ethers
- Tailwind CSS
- Radix UI

## Development Notes

- Vite exposes frontend environment variables only when they are prefixed with `VITE_`.
- The `@` import alias maps to `frontend/src`.
- The Vite configuration includes Node polyfills for `buffer`, `crypto`, `stream`, and `util`.
