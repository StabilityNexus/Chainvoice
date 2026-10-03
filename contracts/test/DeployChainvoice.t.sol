// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Test} from "forge-std/Test.sol";
import {Chainvoice} from "../src/Chainvoice.sol";
import {DeployChainvoice} from "../script/Chainvoice.s.sol";

contract DeployChainvoiceTest is Test {
    address constant TREASURY = address(0x999);

    // vm.setEnv changes the environment of the whole process, which forge
    // shares between tests running in parallel, so every scenario runs here
    // in sequence rather than in separate test functions.
    function testRun_AppliesEnvSettings() public {
        DeployChainvoice script = new DeployChainvoice();

        // Unset (blank, as in .env.example): constructor defaults.
        _setEnv("", "");
        Chainvoice c = script.run();
        assertTrue(c.owner() != address(0));
        assertEq(c.treasuryAddress(), address(0));
        assertEq(c.fee(), 0.0005 ether);

        // Both set: applied in the deploy broadcast.
        _setEnv("0x0000000000000000000000000000000000000999", "1000000000000000");
        c = script.run();
        assertEq(c.treasuryAddress(), TREASURY);
        assertEq(c.fee(), 0.001 ether);

        // An explicit zero fee is a fee, not "unset".
        _setEnv("", "0");
        c = script.run();
        assertEq(c.fee(), 0);
        assertEq(c.treasuryAddress(), address(0));

        // The settings calls are onlyOwner, so they could only succeed because
        // the broadcaster that deployed is the owner; it can keep configuring.
        vm.prank(c.owner());
        c.setTreasuryAddress(TREASURY);
        assertEq(c.treasuryAddress(), TREASURY);

        _setEnv("", "");
    }

    function _setEnv(string memory treasury, string memory feeWei) private {
        vm.setEnv("TREASURY_ADDRESS", treasury);
        vm.setEnv("FEE_WEI", feeWei);
    }
}
