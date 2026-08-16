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

The provided `.env.example` includes deployed contract addresses for supported networks and the WalletConnect project ID placeholder:

```env
VITE_CONTRACT_ADDRESS_11155111=0x7bC4C5abb5b1B8355Aa65307C1cFDbe6254505d2
VITE_CONTRACT_ADDRESS_61=
VITE_CONTRACT_ADDRESS_137=
VITE_WALLETCONNECT_PROJECT_ID=
```

> ⚠️ Ethereum Classic and Polygon are left blank on purpose. Both still run the
> v1 contract, which does not match the current ABI. The app treats any
> non-empty address as supported, so filling these in would send calls those
> contracts cannot decode. Populate them only after redeploying.

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
