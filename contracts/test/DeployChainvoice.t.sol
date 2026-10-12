// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Test} from "forge-std/Test.sol";
import {Chainvoice} from "../src/Chainvoice.sol";
import {DeployChainvoice} from "../script/Chainvoice.s.sol";

contract DeployChainvoiceTest is Test {
    address constant CONTROLLER = address(0x998);
    address constant RECIPIENT = address(0x999);
    string constant CONTROLLER_STR = "0x0000000000000000000000000000000000000998";
    string constant RECIPIENT_STR = "0x0000000000000000000000000000000000000999";

    // vm.setEnv changes the environment of the whole process, which forge
    // shares between tests running in parallel, so every scenario runs here
    // in sequence rather than in separate test functions.
    function testRun_AppliesEnvSettings() public {
        DeployChainvoice script = new DeployChainvoice();

        // FEE_WEI blank (as in .env.example): the default fee.
        _setEnv(CONTROLLER_STR, RECIPIENT_STR, "");
        Chainvoice c = script.run();
        assertEq(c.feeController(), CONTROLLER);
        assertEq(c.feeRecipient(), RECIPIENT);
        assertEq(c.fee(), 0.0005 ether);

        // FEE_WEI set.
        _setEnv(CONTROLLER_STR, RECIPIENT_STR, "1000000000000000");
        c = script.run();
        assertEq(c.fee(), 0.001 ether);

        // The deployed controller can configure the contract.
        vm.prank(CONTROLLER);
        c.setFeeAmount(1);
        assertEq(c.fee(), 1);

        // A zero fee is rejected by the constructor, not treated as unset.
        _setEnv(CONTROLLER_STR, RECIPIENT_STR, "0");
        vm.expectRevert(Chainvoice.InvalidAmount.selector);
        script.run();
        vm.stopBroadcast();

        // Zero addresses are rejected by the constructor.
        _setEnv("0x0000000000000000000000000000000000000000", RECIPIENT_STR, "");
        vm.expectRevert(Chainvoice.ZeroAddress.selector);
        script.run();
        vm.stopBroadcast();
        _setEnv(CONTROLLER_STR, "0x0000000000000000000000000000000000000000", "");
        vm.expectRevert(Chainvoice.ZeroAddress.selector);
        script.run();
        vm.stopBroadcast();

        // Blank controller or recipient is not a deployable config.
        _setEnv("", RECIPIENT_STR, "");
        vm.expectRevert();
        script.run();
        vm.stopBroadcast();
        _setEnv(CONTROLLER_STR, "", "");
        vm.expectRevert();
        script.run();
        vm.stopBroadcast();

        _setEnv("", "", "");
    }

    function _setEnv(string memory controller, string memory recipient, string memory feeWei) private {
        vm.setEnv("FEE_CONTROLLER", controller);
        vm.setEnv("FEE_RECIPIENT", recipient);
        vm.setEnv("FEE_WEI", feeWei);
    }
}
