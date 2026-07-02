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

2. Install dependencies:

```bash
npm install
```

3. Create your local environment file:

```bash
cp .env.example .env
```

4. Add your WalletConnect Project ID to `.env`:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_reown_project_id
```

5. Start the development server:

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
VITE_CONTRACT_ADDRESS_11155111=0x54a542dCDC306eE281b5De4613EcEfe6e6ABc562
VITE_CONTRACT_ADDRESS_61=0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe
VITE_CONTRACT_ADDRESS_137=0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe
VITE_WALLETCONNECT_PROJECT_ID=
```

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
