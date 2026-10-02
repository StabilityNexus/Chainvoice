// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Chainvoice} from "../src/Chainvoice.sol";
import {Script, console} from "../lib/forge-std/src/Script.sol";

/// Deploys Chainvoice and, when given, applies the per-chain settings in the
/// same broadcast so the contract never sits live without a treasury.
///
///   TREASURY_ADDRESS  where withdrawFees() sends fees (optional)
///   FEE_WEI           native fee per paid invoice (optional, default 0.0005 ether)
contract DeployChainvoice is Script {
    function run() external returns (Chainvoice c) {
        address treasury = vm.envOr("TREASURY_ADDRESS", address(0));
        uint256 feeWei = vm.envOr("FEE_WEI", uint256(0));

        vm.startBroadcast();
        c = new Chainvoice();
        if (treasury != address(0)) c.setTreasuryAddress(treasury);
        if (feeWei != 0) c.setFeeAmount(feeWei);
        vm.stopBroadcast();

        console.log("Chainvoice deployed at", address(c));
        console.log("owner", c.owner());
        console.log("treasury", c.treasuryAddress());
        console.log("fee (wei)", c.fee());
    }
}
