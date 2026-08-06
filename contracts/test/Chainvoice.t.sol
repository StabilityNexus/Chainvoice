/* SPDX-License-Identifier: Unlicense */
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import "../src/Chainvoice.sol";

contract ChainvoiceTest is Test {
    Chainvoice chainvoice;

    address alice = address(0xA11CE);
    address bob = address(0xB0B);
    address charlie = address(0xC4A7);

    event PublicKeyRegistered(address indexed user, bytes publicKey);

    function setUp() public {
        chainvoice = new Chainvoice();
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(charlie, 100 ether);
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
            keccak256("encryptedData")
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
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("encrypted"));

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
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("data"));

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
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("data"));
        uint256 fee = chainvoice.fee();
        vm.expectRevert(Chainvoice.NotAuthorizedPayer.selector);
        vm.prank(alice);
        chainvoice.payInvoice{value: 1 ether + fee}(0);
    }

    function testPayInvoice_RevertIfIncorrectValue() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("data"));

        vm.expectRevert(Chainvoice.IncorrectPaymentAmount.selector);
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
        bytes32[] memory payloads = new bytes32[](batchSize);

        for (uint256 i = 0; i < batchSize; i++) {
            tos[i] = bob;
            amounts[i] = 1 ether;
            payloads[i] = keccak256(abi.encodePacked("batch", i));
        }

        vm.prank(alice);
        vm.expectRevert(Chainvoice.InvalidBatchSize.selector);
        chainvoice.createInvoicesBatch(tos, amounts, address(0), payloads);
    }

    function testCreateInvoicesBatch() public {
        uint256 batchSize = 3;
        address[] memory tos = new address[](batchSize);
        uint256[] memory amounts = new uint256[](batchSize);
        bytes32[] memory payloads = new bytes32[](batchSize);

        for (uint256 i = 0; i < batchSize; i++) {
            tos[i] = bob;
            amounts[i] = 1 ether;
            payloads[i] = keccak256("batchData");
        }

        vm.prank(alice);
        chainvoice.createInvoicesBatch(tos, amounts, address(0), payloads);

        Chainvoice.InvoiceDetails[] memory sent = chainvoice.getSentInvoices(alice);
        Chainvoice.InvoiceDetails[] memory received = chainvoice.getReceivedInvoices(bob);

        assertEq(sent.length, 3);
        assertEq(received.length, 3);
        assertEq(sent[2].amountDue, 1 ether);
        for (uint256 i = 0; i < batchSize; i++) {
            assertEq(sent[i].invoiceDataHash, payloads[i]);
            assertEq(received[i].invoiceDataHash, payloads[i]);
        }
    }

    function testPayInvoicesBatch() public {
        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("pay1"));
        chainvoice.createInvoice(bob, 2 ether, address(0), keccak256("pay2"));
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
        vm.assume(amount > 0);

        vm.prank(alice);
        chainvoice.createInvoice(recipient, amount, address(0), keccak256("fuzz"));

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
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("withdraw"));

        uint256 fee = chainvoice.fee();
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);

        assertEq(chainvoice.accumulatedFees(), fee);

        chainvoice.withdrawFees();

        assertEq(chainvoice.accumulatedFees(), 0);
        assertEq(treasury.balance, fee);
    }

    /*                    OWNERSHIP MANAGEMENT                      */
    /* ------------------------------------------------------------ */

    function testInitiateOwnershipTransfer() public {
        address newOwner = address(0xC0FFEE);
        
        vm.prank(alice); // alice is not the owner
        vm.expectRevert(Chainvoice.Unauthorized.selector);
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

    /* ------------------------------------------------------------ */
    /*                  MESSAGING KEY REGISTRY                       */
    /* ------------------------------------------------------------ */

    function testRegisterPublicKey() public {
        // 65-byte uncompressed secp256k1 public key (0x04 prefix + 64 bytes)
        bytes memory pubKey = new bytes(65);
        pubKey[0] = 0x04;
        for (uint256 i = 1; i < 65; i++) {
            pubKey[i] = bytes1(uint8(i));
        }

        vm.prank(alice);
        chainvoice.registerPublicKey(pubKey);

        bytes memory stored = chainvoice.getPublicKey(alice);
        assertEq(stored.length, 65);
        assertEq(stored[0], pubKey[0]);
        assertEq(stored[64], pubKey[64]);
    }

    function testRegisterPublicKey_EmitsEvent() public {
        bytes memory pubKey = new bytes(65);
        pubKey[0] = 0x04;
        for (uint256 i = 1; i < 65; i++) {
            pubKey[i] = bytes1(uint8(i + 100));
        }

        vm.expectEmit(true, false, false, true);
        emit PublicKeyRegistered(alice, pubKey);

        vm.prank(alice);
        chainvoice.registerPublicKey(pubKey);
    }

    function testUpdatePublicKey() public {
        bytes memory key1 = new bytes(65);
        key1[0] = 0x04;
        for (uint256 i = 1; i < 65; i++) key1[i] = bytes1(uint8(i));

        bytes memory key2 = new bytes(65);
        key2[0] = 0x04;
        for (uint256 i = 1; i < 65; i++) key2[i] = bytes1(uint8(i + 50));

        vm.startPrank(alice);
        chainvoice.registerPublicKey(key1);

        bytes memory stored1 = chainvoice.getPublicKey(alice);
        assertEq(keccak256(stored1), keccak256(key1));

        // Update to a new key
        chainvoice.registerPublicKey(key2);
        vm.stopPrank();

        bytes memory stored2 = chainvoice.getPublicKey(alice);
        assertEq(keccak256(stored2), keccak256(key2));
    }

    function testGetPublicKey_Unregistered() public {
        bytes memory stored = chainvoice.getPublicKey(address(0xDEAD));
        assertEq(stored.length, 0);
    }

    function testMultipleUsersRegisterKeys() public {
        bytes memory aliceKey = new bytes(65);
        aliceKey[0] = 0x04;
        for (uint256 i = 1; i < 65; i++) aliceKey[i] = bytes1(uint8(i));

        bytes memory bobKey = new bytes(65);
        bobKey[0] = 0x04;
        for (uint256 i = 1; i < 65; i++) bobKey[i] = bytes1(uint8(i + 50));

        vm.prank(alice);
        chainvoice.registerPublicKey(aliceKey);

        vm.prank(bob);
        chainvoice.registerPublicKey(bobKey);

        assertEq(keccak256(chainvoice.getPublicKey(alice)), keccak256(aliceKey));
        assertEq(keccak256(chainvoice.getPublicKey(bob)), keccak256(bobKey));
    }

    function testRegisterPublicKey_RevertIfInvalidLength() public {
        bytes memory shortKey = hex"04aabbccdd";

        vm.prank(alice);
        vm.expectRevert(Chainvoice.InvalidPublicKey.selector);
        chainvoice.registerPublicKey(shortKey);
    }

    function testCreateInvoice_RevertIfZeroHash() public {
        vm.prank(alice);
        vm.expectRevert(Chainvoice.InvalidInvoiceHash.selector);
        chainvoice.createInvoice(bob, 1 ether, address(0), bytes32(0));
    }

    function testRegisterPublicKey_RevertIfInvalidPrefix() public {
        bytes memory badPrefixKey = new bytes(65);
        badPrefixKey[0] = 0x03; // wrong prefix, should be 0x04
        for (uint256 i = 1; i < 65; i++) badPrefixKey[i] = bytes1(uint8(i));

        vm.prank(alice);
        vm.expectRevert(Chainvoice.InvalidPublicKey.selector);
        chainvoice.registerPublicKey(badPrefixKey);
    }

    function testCreateInvoiceWithDataHash() public {
        // Test that createInvoice works with the new bytes32 hash field
        bytes32 testHash = keccak256("test invoice data");
        vm.prank(alice);
        chainvoice.createInvoice(
            bob,
            1 ether,
            address(0),
            testHash
        );

        Chainvoice.InvoiceDetails memory inv = chainvoice.getInvoice(0);
        assertEq(inv.from, alice);
        assertEq(inv.to, bob);
        assertEq(inv.amountDue, 1 ether);
        assertEq(inv.invoiceDataHash, testHash);
    }

    function testCreateInvoicesBatch_RevertIfZeroHash() public {
        address[] memory tos = new address[](2);
        tos[0] = bob;
        tos[1] = charlie;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1 ether;
        amounts[1] = 2 ether;

        bytes32[] memory hashes = new bytes32[](2);
        hashes[0] = keccak256("valid hash");
        hashes[1] = bytes32(0); // This should cause a revert


        vm.prank(alice);
        vm.expectRevert(Chainvoice.InvalidInvoiceHash.selector);
        chainvoice.createInvoicesBatch(tos, amounts, address(0), hashes);
    }
}
