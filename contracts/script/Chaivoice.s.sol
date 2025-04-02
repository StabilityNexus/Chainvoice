// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Chainvoice} from "../src/Chainvoice.sol";
import {Script} from "../lib/forge-std/src/Script.sol";
contract CounterScript is Script {
    Chainvoice public c;
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        c = new Chainvoice();
        vm.stopBroadcast();
    }
}
