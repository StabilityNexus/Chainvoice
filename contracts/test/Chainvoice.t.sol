// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import "../src/Chainvoice.sol";

contract ChainvoiceTest is Test {
    Chainvoice chainvoice;

    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    event FeeUpdated(uint256 oldFee, uint256 newFee);

    function setUp() public {
        chainvoice = new Chainvoice();
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
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
    /* ADMIN & GOVERNANCE TESTS                     */
    /* ------------------------------------------------------------ */

    function testSetFeeAmount_EmitsEvent() public {
        uint256 newFee = 0.001 ether;
        
        // Tell Foundry to expect the FeeUpdated event
        // (bool checkTopic1, bool checkTopic2, bool checkTopic3, bool checkData)
        vm.expectEmit(false, false, false, true);
        emit FeeUpdated(chainvoice.fee(), newFee);
        
        chainvoice.setFeeAmount(newFee);
        
        assertEq(chainvoice.fee(), newFee);
    }

    function testTwoStepOwnershipTransfer() public {
        // Step 1: Current owner (this test contract) starts transfer
        chainvoice.transferOwnership(alice);
        
        // Owner should still be the original owner, pending is Alice
        assertEq(chainvoice.owner(), address(this));
        assertEq(chainvoice.pendingOwner(), alice);

        // Step 2: Alice accepts the ownership
        vm.prank(alice);
        chainvoice.acceptOwnership();

        // Ownership should now be fully transferred
        assertEq(chainvoice.owner(), alice);
        assertEq(chainvoice.pendingOwner(), address(0));
    }

    function testAcceptOwnership_RevertsIfNotPending() public {
        chainvoice.transferOwnership(alice);
        
        // Bob tries to accept, but he isn't the pending owner
        vm.prank(bob);
        vm.expectRevert("Caller is not the pending owner");
        chainvoice.acceptOwnership();
    }
}