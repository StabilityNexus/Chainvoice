// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Chainvoice} from "../src/Chainvoice.sol";
import {Script, console} from "../lib/forge-std/src/Script.sol";

/// Deploys Chainvoice with its fee settings fixed at construction.
///
///   FEE_CONTROLLER  sets the fee and the fee recipient, and can hand its role
///                   to a successor in two steps (required, non-zero)
///   FEE_RECIPIENT   receives withdrawn fees (required, non-zero)
///   FEE_WEI         native fee per paid invoice (optional; blank or unset uses
///                   the 0.0005 ether default; the constructor rejects 0)
contract DeployChainvoice is Script {
    uint256 internal constant DEFAULT_FEE = 0.0005 ether;

    function run() external returns (Chainvoice c) {
        // Read as strings so a blank line in .env (as in .env.example) counts
        // as unset instead of failing to parse.
        string memory controller = vm.envString("FEE_CONTROLLER");
        string memory recipient = vm.envString("FEE_RECIPIENT");
        string memory feeWei = vm.envOr("FEE_WEI", string(""));

        uint256 fee = bytes(feeWei).length != 0 ? vm.parseUint(feeWei) : DEFAULT_FEE;

        vm.startBroadcast();
        c = new Chainvoice(fee, vm.parseAddress(controller), vm.parseAddress(recipient));
        vm.stopBroadcast();

        console.log("Chainvoice deployed at", address(c));
        console.log("feeController", c.feeController());
        console.log("feeRecipient", c.feeRecipient());
        console.log("fee (wei)", c.fee());
    }
}
