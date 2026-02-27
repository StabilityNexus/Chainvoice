// SPDX-License-Identifier: Unlicense
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
    /*                    OWNERSHIP MANAGEMENT                      */
    /* ------------------------------------------------------------ */

    function testInitiateOwnershipTransfer() public {
        address newOwner = address(0xC0FFEE);
        
        vm.prank(alice); // alice is not the owner
        vm.expectRevert("Only owner can call");
        chainvoice.initiateOwnershipTransfer(newOwner);

        vm.prank(address(this)); // this is the owner (from setUp)
        chainvoice.initiateOwnershipTransfer(newOwner);
        
        assertEq(chainvoice.pendingOwner(), newOwner);
    }

    function testInitiateOwnershipTransferInvalidAddress() public {
        vm.expectRevert(Chainvoice.InvalidNewOwner.selector);
        chainvoice.initiateOwnershipTransfer(address(0));

        // Try to transfer to self
        vm.expectRevert(Chainvoice.InvalidNewOwner.selector);
        chainvoice.initiateOwnershipTransfer(address(this));
    }

    function testAcceptOwnership() public {
        address newOwner = address(0xC0FFEE);
        
        chainvoice.initiateOwnershipTransfer(newOwner);
        
        vm.prank(newOwner);
        chainvoice.acceptOwnership();
        
        assertEq(chainvoice.owner(), newOwner);
        assertEq(chainvoice.pendingOwner(), address(0));
    }

    function testAcceptOwnershipNotPending() public {
        vm.prank(address(0xDEADBEEF));
        vm.expectRevert(Chainvoice.OwnershipNotPending.selector);
        chainvoice.acceptOwnership();
    }

    function testCancelOwnershipTransfer() public {
        address newOwner = address(0xC0FFEE);
        
        chainvoice.initiateOwnershipTransfer(newOwner);
        assertEq(chainvoice.pendingOwner(), newOwner);
        
        chainvoice.cancelOwnershipTransfer();
        assertEq(chainvoice.pendingOwner(), address(0));
    }

    function testCancelOwnershipTransferNoPending() public {
        vm.expectRevert(Chainvoice.OwnershipNotPending.selector);
        chainvoice.cancelOwnershipTransfer();
    }

    function testFeeUpdateEvent() public {
        uint256 newFee = 0.001 ether;
        chainvoice.setFeeAmount(newFee);
        assertEq(chainvoice.fee(), newFee);
    }

    function testTreasuryAddressUpdateEvent() public {
        address newTreasury = address(0xdead);
        chainvoice.setTreasuryAddress(newTreasury);
        assertEq(chainvoice.treasuryAddress(), newTreasury);
    }
}