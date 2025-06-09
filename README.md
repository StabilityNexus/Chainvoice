# Chainvoice

Chainvoice is a decentralized invoice management system built on blockchain technology. It offers a secure, transparent, and tamper-proof platform for creating, managing, and paying invoices. Leveraging Ethereum smart contracts, Chainvoice ensures trust, automation, and eliminates the need for intermediaries in financial transactions.

## Getting Started

1. Fork the Repository
2. Clone the forked repository to your local machine:
```bash
git clone https://github.com/yourusername/Chainvoice.git
```
3. Project Structure
The repository contains two main folders:

- frontend: The user interface of the application.
- contracts: The smart contracts powering the backend logic.

## Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```
2. Install the dependencies::
```bash
npm install
```
3. Start the development server::
```bash
npm run dev
```
4. Open the app in your browser at http://localhost:5173.

## Smart Contract Testing

1. Navigate to the contracts folder:
```bash
cd contracts
```
2. Install dependencies using Foundry:
```bash
forge install
```
3. Run tests
```bash
forge test
```
## Deploying to Ethereum Classic (ETC) with Foundry

This guide explains how to deploy Chainvoice smart contracts to the Ethereum Classic Mainnet using Foundry (Forge).

Prerequisites
- Foundry installed
- A funded wallet with ETC
- RPC URL (e.g. from Rivet, Ankr, or Chainstack)

1. Create .env File for Secrets

    - Create a .env in your project root i.e. `contracts/`
    - Copy all the varible from `contracts/.env-copy` to newly created `.env`
    
        `cp .env-copy .env`
    - Assign valid values to the variable.

2. Compile Contract
        
    `forge build`
3. Load your .env in the terminal

    `source .env`
4. Deploy the Contract using forge create

```
forge create src/Contract.sol:Contract \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
```
5. Finally add Contract Address to Frontend `.env`
    -  Create a new .env file by copying .env-copy:
    
        `cp frontend/.env-copy frontend/.env`
    - Open the new .env file and update the variables, especially:
    `VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here`
    
    Replace your_deployed_contract_address_here with the actual contract address you got after deployment.

    - Save the .env file.

    - Restart your frontend development server so the new environment variables are loaded.