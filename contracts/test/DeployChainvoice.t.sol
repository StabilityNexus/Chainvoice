// SPDX-License-Identifier: UNLICENSED
// Licensing: see https://github.com/StabilityNexus/Chainvoice
pragma solidity 0.8.19;

import {Test} from "forge-std/Test.sol";
import {Chainvoice} from "../src/Chainvoice.sol";
import {DeployChainvoice} from "../script/Chainvoice.s.sol";

contract DeployChainvoiceTest is Test {
    address constant DEV = address(0x998);
    address constant FEE_RECEIVER = address(0x999);
    string constant DEV_STR = "0x0000000000000000000000000000000000000998";
    string constant FEE_RECEIVER_STR = "0x0000000000000000000000000000000000000999";

    // vm.setEnv changes the environment of the whole process, which forge
    // shares between tests running in parallel, so every scenario runs here
    // in sequence rather than in separate test functions.
    function testRun_AppliesEnvSettings() public {
        DeployChainvoice script = new DeployChainvoice();

        // DEV_FEE_WEI blank (as in .env.example): the default fee.
        _setEnv(DEV_STR, FEE_RECEIVER_STR, "");
        Chainvoice c = script.run();
        assertEq(c.dev(), DEV);
        assertEq(c.devFeeReceiver(), FEE_RECEIVER);
        assertEq(c.devFee(), 0.0005 ether);

        // DEV_FEE_WEI set.
        _setEnv(DEV_STR, FEE_RECEIVER_STR, "1000000000000000");
        c = script.run();
        assertEq(c.devFee(), 0.001 ether);

        // The deployed dev can configure the contract.
        vm.prank(DEV);
        c.setDevFee(1);
        assertEq(c.devFee(), 1);

        // A zero fee is rejected by the constructor, not treated as unset.
        _setEnv(DEV_STR, FEE_RECEIVER_STR, "0");
        vm.expectRevert(Chainvoice.InvalidAmount.selector);
        script.run();
        vm.stopBroadcast();

        // Zero addresses are rejected by the constructor.
        _setEnv("0x0000000000000000000000000000000000000000", FEE_RECEIVER_STR, "");
        vm.expectRevert(Chainvoice.ZeroAddress.selector);
        script.run();
        vm.stopBroadcast();
        _setEnv(DEV_STR, "0x0000000000000000000000000000000000000000", "");
        vm.expectRevert(Chainvoice.ZeroAddress.selector);
        script.run();
        vm.stopBroadcast();

        // Blank dev or fee receiver is not a deployable config.
        _setEnv("", FEE_RECEIVER_STR, "");
        vm.expectRevert();
        script.run();
        vm.stopBroadcast();
        _setEnv(DEV_STR, "", "");
        vm.expectRevert();
        script.run();
        vm.stopBroadcast();

        _setEnv("", "", "");
    }

    function _setEnv(string memory dev, string memory feeReceiver, string memory devFeeWei) private {
        vm.setEnv("DEV_ADDRESS", dev);
        vm.setEnv("DEV_FEE_RECEIVER", feeReceiver);
        vm.setEnv("DEV_FEE_WEI", devFeeWei);
    }
}
