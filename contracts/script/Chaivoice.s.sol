// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Chainvoice} from "../src/Chainvoice.sol";
import {Script} from "../lib/forge-std/src/Script.sol";
import '../src/MockV3Aggregator.sol';
contract CounterScript is Script {
    Chainvoice public c;
    MockV3Aggregator public mockPriceFeed;
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        mockPriceFeed = new MockV3Aggregator(8, 200000000000);
        c = new Chainvoice(address(mockPriceFeed));
        vm.stopBroadcast();
    }
}
