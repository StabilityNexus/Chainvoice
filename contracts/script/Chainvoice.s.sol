// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Chainvoice} from "../src/Chainvoice.sol";
import {Script, console} from "../lib/forge-std/src/Script.sol";

/// Deploys Chainvoice with its fee settings fixed at construction.
///
///   DEV_ADDRESS       sets devFee and devFeeReceiver, and can hand its role
///                     to a successor in two steps (required, non-zero)
///   DEV_FEE_RECEIVER  receives withdrawn fees (required, non-zero)
///   DEV_FEE_WEI       native fee per paid invoice (optional; blank or unset uses
///                     the 0.0005 ether default; the constructor rejects 0)
contract DeployChainvoice is Script {
    uint256 internal constant DEFAULT_DEV_FEE = 0.0005 ether;

    function run() external returns (Chainvoice c) {
        // Read as strings so a blank line in .env (as in .env.example) counts
        // as unset instead of failing to parse.
        string memory dev = vm.envString("DEV_ADDRESS");
        string memory devFeeReceiver = vm.envString("DEV_FEE_RECEIVER");
        string memory devFeeWei = vm.envOr("DEV_FEE_WEI", string(""));

        uint256 devFee = bytes(devFeeWei).length != 0 ? vm.parseUint(devFeeWei) : DEFAULT_DEV_FEE;

        vm.startBroadcast();
        c = new Chainvoice(devFee, vm.parseAddress(dev), vm.parseAddress(devFeeReceiver));
        vm.stopBroadcast();

        console.log("Chainvoice deployed at", address(c));
        console.log("dev", c.dev());
        console.log("devFeeReceiver", c.devFeeReceiver());
        console.log("devFee (wei)", c.devFee());
    }
}
