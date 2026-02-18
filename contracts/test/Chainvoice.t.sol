/* SPDX-License-Identifier: Unlicense */
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import "../src/Chainvoice.sol";

contract ChainvoiceTest is Test {
    Chainvoice chainvoice;

    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        chainvoice = new Chainvoice();
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    /* ------------------------------------------------------------ */
    /*                       CREATE INVOICE                         */
    /* ------------------------------------------------------------ */

    function testCreateInvoice_Native() public {
        vm.prank(alice);
        chainvoice.createInvoice(
            bob,
            1 ether,
            address(0),
            "encryptedData",
            "hash123"
        );

        Chainvoice.InvoiceDetails[] memory sent = chainvoice.getSentInvoices(
            alice
        );

        Chainvoice.InvoiceDetails[] memory received = chainvoice
            .getReceivedInvoices(bob);

        assertEq(sent.length, 1);
        assertEq(received.length, 1);

        Chainvoice.InvoiceDetails memory inv = sent[0];

        assertEq(inv.from, alice);
        assertEq(inv.to, bob);
        assertEq(inv.amountDue, 1 ether);
        assertEq(inv.tokenAddress, address(0));
        assertFalse(inv.isPaid);
        assertFalse(inv.isCancelled);
    }

    /* ------------------------------------------------------------ */
    /*                       PAY INVOICE                            */
    /* ------------------------------------------------------------ */

    function testPayInvoice_Native() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), "encrypted", "hash");

        uint256 fee = chainvoice.fee();
        uint256 bobStartBal = bob.balance;
        uint256 aliceStartBal = alice.balance;

        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);

        Chainvoice.InvoiceDetails memory inv = chainvoice.getInvoice(0);

        assertTrue(inv.isPaid);
        assertEq(chainvoice.accumulatedFees(), fee);

        assertEq(bob.balance, bobStartBal - (1 ether + fee));
        assertEq(alice.balance, aliceStartBal + 1 ether);
    }

    /* ------------------------------------------------------------ */
    /*                       CANCEL INVOICE                         */
    /* ------------------------------------------------------------ */

    function testCancelInvoice() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), "data", "hash");

        vm.prank(alice);
        chainvoice.cancelInvoice(0);

        Chainvoice.InvoiceDetails memory inv = chainvoice.getInvoice(0);

        assertTrue(inv.isCancelled);
        assertFalse(inv.isPaid);
    }

    /* ------------------------------------------------------------ */
    /*                       FAILURE CASES                          */
    /* ------------------------------------------------------------ */

    function testPayInvoice_RevertIfWrongPayer() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), "data", "hash");
        uint256 fee = chainvoice.fee();
        vm.expectRevert("Not authorized");
        vm.prank(alice);
        chainvoice.payInvoice{value: 1 ether + fee}(0);
    }

    function testPayInvoice_RevertIfIncorrectValue() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), "data", "hash");

        vm.expectRevert("Incorrect payment amount");
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether}(0);
    }

    /* ------------------------------------------------------------ */
    /*                       BATCH OPERATIONS                       */
    /* ------------------------------------------------------------ */

    function testBatchTooLarge() public {
        uint256 batchSize = 51;
        address[] memory tos = new address[](batchSize);
        uint256[] memory amounts = new uint256[](batchSize);
        string[] memory payloads = new string[](batchSize);
        string[] memory hashes = new string[](batchSize);

        for (uint256 i = 0; i < batchSize; i++) {
            tos[i] = bob;
            amounts[i] = 1 ether;
            payloads[i] = "";
            hashes[i] = "";
        }

        vm.prank(alice);
        vm.expectRevert(Chainvoice.InvalidBatchSize.selector);
        chainvoice.createInvoicesBatch(tos, amounts, address(0), payloads, hashes);
    }

    function testCreateInvoicesBatch() public {
        uint256 batchSize = 3;
        address[] memory tos = new address[](batchSize);
        uint256[] memory amounts = new uint256[](batchSize);
        string[] memory payloads = new string[](batchSize);
        string[] memory hashes = new string[](batchSize);

        for (uint256 i = 0; i < batchSize; i++) {
            tos[i] = bob;
            amounts[i] = 1 ether;
            payloads[i] = "batchData";
            hashes[i] = "batchHash";
        }

        vm.prank(alice);
        chainvoice.createInvoicesBatch(tos, amounts, address(0), payloads, hashes);

        Chainvoice.InvoiceDetails[] memory sent = chainvoice.getSentInvoices(alice);
        Chainvoice.InvoiceDetails[] memory received = chainvoice.getReceivedInvoices(bob);

        assertEq(sent.length, 3);
        assertEq(received.length, 3);
        assertEq(sent[2].amountDue, 1 ether);
    }

    function testPayInvoicesBatch() public {
        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), "", "");
        chainvoice.createInvoice(bob, 2 ether, address(0), "", "");
        vm.stopPrank();

        uint256 fee = chainvoice.fee();
        uint256 totalFee = fee * 2;
        uint256 totalPrincipal = 3 ether;

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;

        uint256 bobStart = bob.balance;
        uint256 aliceStart = alice.balance;

        vm.prank(bob);
        chainvoice.payInvoicesBatch{value: totalPrincipal + totalFee}(ids);

        Chainvoice.InvoiceDetails memory inv0 = chainvoice.getInvoice(0);
        Chainvoice.InvoiceDetails memory inv1 = chainvoice.getInvoice(1);

        assertTrue(inv0.isPaid);
        assertTrue(inv1.isPaid);

        assertEq(chainvoice.accumulatedFees(), totalFee);
        assertEq(bob.balance, bobStart - (totalPrincipal + totalFee));
        assertEq(alice.balance, aliceStart + totalPrincipal);
    }

    /* ------------------------------------------------------------ */
    /*                       FUZZ TESTING                           */
    /* ------------------------------------------------------------ */

    function testFuzz_CreateInvoice(address recipient, uint256 amount) public {
        vm.assume(recipient != address(0));
        vm.assume(recipient != alice);
        vm.assume(amount < 1000000 ether);

        vm.prank(alice);
        chainvoice.createInvoice(recipient, amount, address(0), "fuzz", "hash");

        Chainvoice.InvoiceDetails[] memory sent = chainvoice.getSentInvoices(alice);
        Chainvoice.InvoiceDetails memory latest = sent[sent.length - 1];

        assertEq(latest.to, recipient);
        assertEq(latest.amountDue, amount);
    }

    /* ------------------------------------------------------------ */
    /*                       ADMIN / FEES                           */
    /* ------------------------------------------------------------ */

    function testWithdrawFees() public {
        address treasury = address(0x999);

        chainvoice.setTreasuryAddress(treasury);

        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), "", "");

        uint256 fee = chainvoice.fee();
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);

        assertEq(chainvoice.accumulatedFees(), fee);

        chainvoice.withdrawFees();

        assertEq(chainvoice.accumulatedFees(), 0);
        assertEq(treasury.balance, fee);
    }
}
