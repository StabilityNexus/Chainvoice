// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/MockDAI.sol";

/**
 * @title DeployMockDAI
 * @notice Deploy MockDAI and mint test tokens to yourself.
 *
 * Usage (Anvil):
 *   forge script script/DeployMockDAI.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
 *
 * Usage (Sepolia):
 *   forge script script/DeployMockDAI.s.sol --rpc-url https://rpc.ankr.com/eth_sepolia --broadcast --private-key <YOUR_KEY>
 */
contract DeployMockDAI is Script {
    function run() external {
        vm.startBroadcast();

        MockDAI dai = new MockDAI();

        // Mint 10,000 DAI to the deployer
        dai.mint(msg.sender, 10_000 * 1e18);

        console.log("=== MockDAI Deployed ===");
        console.log("Token Address:", address(dai));
        console.log("Symbol: DAI");
        console.log("Decimals: 18");
        console.log("Minted 10,000 DAI to:", msg.sender);
        console.log("");
        console.log("To mint more tokens, run:");
        console.log("  cast send <TOKEN_ADDRESS> 'mint(address,uint256)' <YOUR_ADDRESS> 10000000000000000000000 --rpc-url <RPC> --private-key <KEY>");

        vm.stopBroadcast();
    }
}
