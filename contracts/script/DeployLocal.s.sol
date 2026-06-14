// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Chainvoice.sol";

/**
 * @title DeployLocal
 * @notice Deploy Chainvoice to a local Anvil instance for development/testing.
 *
 * Usage:
 *   1. Start Anvil: `anvil`
 *   2. Deploy: `forge script script/DeployLocal.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key <ANVIL_PRIVATE_KEY>`
 *   3. Copy the deployed address and set it as VITE_CONTRACT_ADDRESS_31337 in frontend/.env
 */
contract DeployLocal is Script {
    function run() external {
        vm.startBroadcast();

        Chainvoice chainvoice = new Chainvoice();

        console.log("=== Chainvoice Deployed ===");
        console.log("Contract Address:", address(chainvoice));
        console.log("Owner:", chainvoice.owner());
        console.log("Chain ID:", block.chainid);
        console.log("");
        console.log("Next steps:");
        console.log("1. Copy the contract address above");
        console.log("2. Set VITE_CONTRACT_ADDRESS_31337=<address> in frontend/.env");
        console.log("3. Run `npm run dev` in the frontend directory");

        vm.stopBroadcast();
    }
}
