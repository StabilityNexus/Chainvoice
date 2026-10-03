// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Chainvoice} from "../src/Chainvoice.sol";
import {Script, console} from "../lib/forge-std/src/Script.sol";

/// Deploys Chainvoice and, when given, applies the per-chain settings in the
/// same broadcast so the contract never sits live without a treasury.
///
///   TREASURY_ADDRESS  where withdrawFees() sends fees (optional)
///   FEE_WEI           native fee per paid invoice (optional; 0 is a valid
///                     fee, unset or blank keeps the 0.0005 ether default)
contract DeployChainvoice is Script {
    function run() external returns (Chainvoice c) {
        // Read as strings so a blank line in .env (as in .env.example) counts
        // as unset instead of failing to parse.
        string memory treasury = vm.envOr("TREASURY_ADDRESS", string(""));
        string memory feeWei = vm.envOr("FEE_WEI", string(""));

        vm.startBroadcast();
        c = new Chainvoice();
        if (bytes(treasury).length != 0) c.setTreasuryAddress(vm.parseAddress(treasury));
        if (bytes(feeWei).length != 0) c.setFeeAmount(vm.parseUint(feeWei));
        vm.stopBroadcast();

        console.log("Chainvoice deployed at", address(c));
        console.log("owner", c.owner());
        console.log("treasury", c.treasuryAddress());
        console.log("fee (wei)", c.fee());
    }
}
