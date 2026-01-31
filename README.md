check
check
check

<!-- Don't delete it -->
<div name="readme-top"></div>

<!-- Logos -->
<p align="center">
  <img alt="Stability Nexus" src="frontend/public/nexus.png" width="140">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img alt="Chainvoice" src="frontend/public/logo.png" width="140">
</p>

<p align="center">
  <a href="#"><img alt="Stability Nexus · Chainvoice" src="https://img.shields.io/badge/Stability_Nexus-Chainvoice-228B22?style=for-the-badge&labelColor=FFC517"></a>
</p>

<p align="center">
  <a href="https://t.me/StabilityNexus"><img src="https://img.shields.io/badge/Telegram-24A1DE?style=flat&logo=telegram&logoColor=white" alt="Telegram"></a>
  &nbsp;
  <a href="https://x.com/StabilityNexus"><img src="https://img.shields.io/twitter/follow/StabilityNexus" alt="X (Twitter)"></a>
  &nbsp;
  <a href="https://discord.gg/YzDKeEfWtS"><img src="https://img.shields.io/discord/995968619034984528?style=flat&logo=discord&logoColor=white&label=Discord&labelColor=5865F2&color=57F287" alt="Discord"></a>
  &nbsp;
  <a href="https://news.stability.nexus/"><img src="https://img.shields.io/badge/Medium-white?style=flat&logo=medium&logoColor=black" alt="Medium"></a>
  &nbsp;
  <a href="https://linkedin.com/company/stability-nexus"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
  &nbsp;
  <a href="https://www.youtube.com/@StabilityNexus"><img src="https://img.shields.io/youtube/channel/subscribers/UCZOG4YhFQdlGaLugr_e5BKw?style=flat&logo=youtube&logoColor=white&labelColor=FF0000&color=FF0000" alt="YouTube"></a>
</p>

---

# Chainvoice

Chainvoice is a decentralized invoicing platform that enables secure, transparent, and tamper‑proof invoice creation, management, and payments on blockchain. Powered by Ethereum-compatible smart contracts, Chainvoice automates payment flows and reduces reliance on intermediaries.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Frontend Setup](#frontend-setup)
- [Smart Contract Testing](#smart-contract-testing)
- [Deploy to Ethereum Classic](#deploy-to-ethereum-classic)
- [Environment Variables](#environment-variables)
- [Community and Support](#community-and-support)

## Overview

Chainvoice transforms traditional invoicing by leveraging blockchain technology to create a trustless, automated payment system. Users can create invoices, manage payments, and track transaction history with complete transparency and security.

## Features

- **Decentralized Invoice Creation** - Create and manage invoices on-chain
- **Multi-Token Support** - Pay using native currency or ERC-20 tokens
- **Immutable Records** - Verifiable transaction history and status tracking
- **Treasury Management** - Built-in fee management for platform sustainability
- **Privacy Protection** - Encrypted invoice data with access control
- **User-Friendly Interface** - Intuitive web application with wallet integration

## Project Structure

Chainvoice/  
├── frontend/ # Web application (UI/UX, wallet integration)  
├── contracts/ # Solidity smart contracts (core invoicing logic)  
├── docs/ # Documentation and guides  
└── README.md # This file

## Getting Started

1. **Fork the repository**
2. **Clone your fork**

git clone https://github.com/yourusername/Chainvoice.git  
cd Chainvoice

## Frontend Setup

1. **Navigate to frontend directory**  
cd frontend

2. **Install dependencies**  
npm install


3. **Start development server**  
npm run dev


4. **Open application**
Navigate to `http://localhost:5173` in your browser

## Smart Contract Testing

> **Prerequisites:** [Foundry](https://getfoundry.sh/) must be installed

1. **Navigate to contracts directory**  
cd contracts

3. **Run test suite**  
forge test

4. **Run tests with verbosity (optional)**  
forge test -vvv


## Deploy to Ethereum Classic

### Prerequisites
- [Foundry](https://getfoundry.sh/) installed
- Wallet funded with ETC
- ETC RPC URL (e.g., Rivet, Ankr, Chainstack)

### Deployment Steps

1. **Configure environment variables**  
cp contracts/.env.example contracts/.env  
Edit contracts/.env with your actual values

2. **Compile contracts**  
cd contracts  
forge build 

3. **Load environment variables**  
source .env

4. **Deploy to Ethereum Classic**  
forge create contracts/src/Chainvoice.sol:Chainvoice
--rpc-url $ETC_RPC_URL
--private-key $PRIVATE_KEY
--broadcast


5. **Configure frontend**  
cp frontend/.env.example frontend/.env  
Edit frontend/.env and set:  
VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here  

6. **Restart frontend development server**  
cd frontend  
npm run dev  

## Environment Variables

### Frontend Configuration (`frontend/.env`)  
```.env
#Ethereum Sepolia (11155111)
VITE_CONTRACT_ADDRESS_11155111=0x54a542dCDC306eE281b5De4613EcEfe6e6ABc562
#Ethereum Classic (61)
VITE_CONTRACT_ADDRESS_61=0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe
#Polygon Mainnet (137)
VITE_CONTRACT_ADDRESS_137=0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe
#Project ID
VITE_WALLETCONNECT_PROJECT_ID=Your Project ID can be obtained from https://dashboard.reown.com/ 
```
> ⚠️ **Security Note:** Never commit `.env` files to version control. Keep your private keys secure.

## Community and Support

Join our community for support, updates, and discussions:

- **Telegram** - [t.me/StabilityNexus](https://t.me/StabilityNexus)
- **Discord** - [discord.gg/YzDKeEfWtS](https://discord.gg/YzDKeEfWtS)
- **X (Twitter)** - [@StabilityNexus](https://x.com/StabilityNexus)
- **Medium** - [news.stability.nexus](https://news.stability.nexus)
- **LinkedIn** - [linkedin.com/company/stability-nexus](https://linkedin.com/company/stability-nexus)
- **YouTube** - [youtube.com/@StabilityNexus](https://www.youtube.com/@StabilityNexus)

## Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.


<p align="center">
  <strong>Built with ❤️ by Stability Nexus.</strong>
</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>
