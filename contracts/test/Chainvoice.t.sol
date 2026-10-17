/* SPDX-License-Identifier: Unlicense */
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import "../src/Chainvoice.sol";

contract ValidCreationToken {
    function balanceOf(address) external pure returns (uint256) {
        return 0;
    }

    function allowance(address, address) external pure returns (uint256) {
        return 0;
    }
}

contract EmptyReturnToken {
    fallback() external {}
}

contract RevertingBalanceToken {
    function balanceOf(address) external pure returns (uint256) {
        revert();
    }
}

contract ShortBalanceToken {
    function balanceOf(address) external pure returns (uint256) {
        assembly {
            mstore(0, 0)
            return(0, 31)
        }
    }

    function allowance(address, address) external pure returns (uint256) {
        return 0;
    }
}

contract EmptyAllowanceToken {
    function balanceOf(address) external pure returns (uint256) {
        return 0;
    }

    fallback() external {}
}

contract RevertingAllowanceToken {
    function balanceOf(address) external pure returns (uint256) {
        return 0;
    }

    function allowance(address, address) external pure returns (uint256) {
        revert();
    }
}

contract MockERC20 {
    string public name = "Mock ERC20";
    string public symbol = "MOCK";
    uint8 public decimals = 18;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    uint256 public totalSupply;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    function mint(address to, uint256 amount) public {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public virtual returns (bool) {
        if (allowance[from][msg.sender] < amount) return false;
        if (balanceOf[from] < amount) return false;
        
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}

/// USDT-style token: transferFrom and approve return nothing.
contract MockNoReturnERC20 {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) public {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) public {
        allowance[msg.sender][spender] = amount;
    }

    function transferFrom(address from, address to, uint256 amount) public {
        require(allowance[from][msg.sender] >= amount, "allowance");
        require(balanceOf[from] >= amount, "balance");
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
    }
}

/// Deflationary token: burns 1% of every transfer.
contract MockFeeOnTransferERC20 is MockERC20 {
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        if (allowance[from][msg.sender] < amount) return false;
        if (balanceOf[from] < amount) return false;
        uint256 burned = amount / 100;
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount - burned;
        totalSupply -= burned;
        return true;
    }
}

/// Token whose transferFrom calls back into Chainvoice, as a token with
/// transfer hooks could. Records the error the re-entrant call reverted with.
contract ReentrantERC20 is MockERC20 {
    Chainvoice public target;
    bytes public reentryCall;
    bytes public reentryError;

    function arm(Chainvoice _target, bytes calldata data) external {
        target = _target;
        reentryCall = data;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        if (reentryCall.length != 0) {
            bytes memory data = reentryCall;
            delete reentryCall;
            (bool ok, bytes memory err) = address(target).call(data);
            require(!ok, "re-entry succeeded");
            reentryError = err;
        }
        return super.transferFrom(from, to, amount);
    }
}

/// Invoice issuer whose receive() calls back into Chainvoice when paid,
/// optionally forwarding native value. Records the error the re-entrant call
/// reverted with.
contract ReentrantIssuer {
    Chainvoice public immutable target;
    bytes public reentryCall;
    uint256 public reentryValue;
    bytes public reentryError;

    constructor(Chainvoice _target) {
        target = _target;
    }

    function createInvoice(address to, uint256 amount) external {
        target.createInvoice(to, amount, address(0), keccak256("reentrant"));
    }

    function arm(bytes calldata data, uint256 value) external {
        reentryCall = data;
        reentryValue = value;
    }

    receive() external payable {
        if (reentryCall.length == 0) return;
        bytes memory data = reentryCall;
        delete reentryCall;
        (bool ok, bytes memory err) = address(target).call{value: reentryValue}(data);
        require(!ok, "re-entry succeeded");
        reentryError = err;
    }
}

/// A contract with no receive or fallback function, so any ETH sent to it reverts.
contract EthRejectingReceiver {
    function ping() external pure returns (bool) {
        return true;
    }
}

/// Stands in for a vault such as Raindrop: its receive() writes storage, which
/// needs more than the 2,300 gas a transfer() or send() would forward.
contract VaultLikeReceiver {
    uint256 public deposits;
    uint256 public total;

    receive() external payable {
        deposits += 1;
        total += msg.value;
    }
}

contract ChainvoiceTest is Test {
    Chainvoice chainvoice;

    address alice = address(0xA11CE);
    address bob = address(0xB0B);
    address charlie = address(0xC4A7);

    event PublicKeyRegistered(address indexed user, bytes publicKey);

    address dev = address(0xFEE1);
    address devFeeReceiver = address(0xFEE2);
    uint256 constant INITIAL_FEE = 0.0005 ether;

    event DevFeeUpdated(uint256 indexed previousFee, uint256 indexed newFee);
    event DevFeeReceiverUpdated(address indexed previousDevFeeReceiver, address indexed newDevFeeReceiver);
    event DevProposed(address indexed currentDev, address indexed proposedDev);
    event DevUpdated(address indexed previousDev, address indexed newDev);
    event DevProposalCancelled(address indexed currentDev, address indexed cancelledDev);

    function setUp() public {
        chainvoice = new Chainvoice(INITIAL_FEE, dev, devFeeReceiver);
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

        (Chainvoice.InvoiceDetails[] memory sent, ) = chainvoice
            .getSentInvoices(alice, 0, 10);

        (Chainvoice.InvoiceDetails[] memory received, ) = chainvoice
            .getReceivedInvoices(bob, 0, 10);

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

        uint256 fee = chainvoice.devFee();
        uint256 bobStartBal = bob.balance;
        uint256 aliceStartBal = alice.balance;

        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);

        Chainvoice.InvoiceDetails memory inv = chainvoice.getInvoice(0);

        assertTrue(inv.isPaid);
        assertEq(chainvoice.accumulatedDevFees(), fee);

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
        uint256 fee = chainvoice.devFee();
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
        uint256 batchSize = chainvoice.MAX_CREATE_BATCH() + 1;
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

    uint256 constant ETC_BLOCK_GAS_LIMIT = 8_000_000;

    function _batchArgs(uint256 n)
        private
        pure
        returns (address[] memory tos, uint256[] memory amounts, bytes32[] memory hashes)
    {
        tos = new address[](n);
        amounts = new uint256[](n);
        hashes = new bytes32[](n);
        for (uint256 i = 0; i < n; i++) {
            tos[i] = address(uint160(0x1000 + i)); // distinct, never-touched recipients
            amounts[i] = 1 ether;
            hashes[i] = keccak256(abi.encode("cap", i));
        }
    }

    // 21000 intrinsic gas plus calldata (4 per zero byte, 16 per other byte), which
    // gasleft() inside the test does not include.
    function _txOverhead(bytes memory data) private pure returns (uint256 gas) {
        gas = 21000;
        for (uint256 i = 0; i < data.length; i++) {
            gas += data[i] == 0 ? 4 : 16;
        }
    }

    function testBatchLimits() public view {
        assertEq(chainvoice.MAX_CREATE_BATCH(), 30);
        assertEq(chainvoice.MAX_BATCH(), 50);
    }

    function testCreateInvoicesBatch_AtMaxSucceeds() public {
        uint256 n = chainvoice.MAX_CREATE_BATCH();
        (address[] memory tos, uint256[] memory amounts, bytes32[] memory hashes) = _batchArgs(n);

        vm.prank(alice);
        chainvoice.createInvoicesBatch(tos, amounts, address(0), hashes);

        (, uint256 total) = chainvoice.getSentInvoices(alice, 0, 1);
        assertEq(total, n);
    }

    function testCreateInvoicesBatch_RevertAboveMax() public {
        uint256 n = chainvoice.MAX_CREATE_BATCH() + 1;
        (address[] memory tos, uint256[] memory amounts, bytes32[] memory hashes) = _batchArgs(n);

        vm.prank(alice);
        vm.expectRevert(Chainvoice.InvalidBatchSize.selector);
        chainvoice.createInvoicesBatch(tos, amounts, address(0), hashes);
    }

    function testCreateInvoicesBatch_RevertIfEmpty() public {
        (address[] memory tos, uint256[] memory amounts, bytes32[] memory hashes) = _batchArgs(0);

        vm.prank(alice);
        vm.expectRevert(Chainvoice.InvalidBatchSize.selector);
        chainvoice.createInvoicesBatch(tos, amounts, address(0), hashes);
    }

    /// The cap exists so a full batch fits in one Ethereum Classic block. Worst
    /// case is an ERC-20 token and recipients that have never been touched.
    function testCreateInvoicesBatch_MaxSizeFitsEtcBlockGasLimit() public {
        MockERC20 token = new MockERC20();
        uint256 n = chainvoice.MAX_CREATE_BATCH();
        (address[] memory tos, uint256[] memory amounts, bytes32[] memory hashes) = _batchArgs(n);
        bytes memory data = abi.encodeCall(
            Chainvoice.createInvoicesBatch,
            (tos, amounts, address(token), hashes)
        );

        vm.prank(alice);
        uint256 before = gasleft();
        chainvoice.createInvoicesBatch(tos, amounts, address(token), hashes);
        // Separate statements: the compiler may evaluate the right operand of a
        // sum first, which would count the overhead loop itself in the total.
        uint256 execution = before - gasleft();
        uint256 used = execution + _txOverhead(data);

        assertLt(used, ETC_BLOCK_GAS_LIMIT);
    }

    function testPayInvoicesBatch_AcceptsMaxBatch() public {
        uint256 max = chainvoice.MAX_BATCH();
        uint256 perBatch = chainvoice.MAX_CREATE_BATCH();
        uint256[] memory ids = new uint256[](max);

        // Created in two batches because one batch is capped at MAX_CREATE_BATCH.
        uint256 made;
        while (made < max) {
            uint256 n = max - made > perBatch ? perBatch : max - made;
            address[] memory tos = new address[](n);
            uint256[] memory amounts = new uint256[](n);
            bytes32[] memory hashes = new bytes32[](n);
            for (uint256 i = 0; i < n; i++) {
                tos[i] = bob;
                amounts[i] = 1 ether;
                hashes[i] = keccak256(abi.encode("pay", made + i));
                ids[made + i] = made + i;
            }
            vm.prank(alice);
            chainvoice.createInvoicesBatch(tos, amounts, address(0), hashes);
            made += n;
        }

        uint256 fee = chainvoice.devFee();
        vm.prank(bob);
        chainvoice.payInvoicesBatch{value: max * (1 ether + fee)}(ids);

        assertEq(chainvoice.accumulatedDevFees(), max * fee);
    }

    function testPayInvoicesBatch_RevertAboveMaxBatch() public {
        uint256[] memory ids = new uint256[](chainvoice.MAX_BATCH() + 1);

        vm.prank(bob);
        vm.expectRevert(Chainvoice.InvalidBatchSize.selector);
        chainvoice.payInvoicesBatch(ids);
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

        (Chainvoice.InvoiceDetails[] memory sent, ) = chainvoice.getSentInvoices(alice, 0, 10);
        (Chainvoice.InvoiceDetails[] memory received, ) = chainvoice.getReceivedInvoices(bob, 0, 10);

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

        uint256 fee = chainvoice.devFee();
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

        assertEq(chainvoice.accumulatedDevFees(), totalFee);
        assertEq(bob.balance, bobStart - (totalPrincipal + totalFee));
        assertEq(alice.balance, aliceStart + totalPrincipal);
    }

    function testPayInvoicesBatch_RevertOnDuplicateId() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("dup1"));

        uint256 fee = chainvoice.devFee();
        uint256 totalFee = fee * 2;
        uint256 totalPrincipal = 2 ether;

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 0;

        vm.prank(bob);
        vm.expectRevert(Chainvoice.AlreadySettled.selector);
        chainvoice.payInvoicesBatch{value: totalPrincipal + totalFee}(ids);
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

        (Chainvoice.InvoiceDetails[] memory sent, ) = chainvoice.getSentInvoices(alice, 0, 10);
        // Pages come back newest first, so the invoice just created leads.
        Chainvoice.InvoiceDetails memory latest = sent[0];

        assertEq(latest.to, recipient);
        assertEq(latest.amountDue, amount);
    }

    /* ------------------------------------------------------------ */
    /*                       ADMIN / FEES                           */
    /* ------------------------------------------------------------ */

    function testWithdrawFees() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("withdraw"));

        uint256 fee = chainvoice.devFee();
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);

        assertEq(chainvoice.accumulatedDevFees(), fee);

        chainvoice.withdrawFees();

        assertEq(chainvoice.accumulatedDevFees(), 0);
        assertEq(devFeeReceiver.balance, fee);
    }

    function testWithdrawFees_AnyoneCanTriggerButReceiverIsPaid() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("withdraw2"));
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + INITIAL_FEE}(0);

        uint256 charlieBefore = charlie.balance;
        vm.prank(charlie);
        chainvoice.withdrawFees();

        assertEq(devFeeReceiver.balance, INITIAL_FEE);
        assertEq(charlie.balance, charlieBefore);
    }

    /// The contract deliberately does not check that the devFeeReceiver can receive
    /// ETH. If it can't, withdrawFees reverts and the fees stay accrued until the
    /// dev points the receiver somewhere that works.
    function testWithdrawFees_RecoversAfterReceiverRejectsEth() public {
        EthRejectingReceiver rejecting = new EthRejectingReceiver();
        address working = address(0x600D);

        // The dev can set a receiver that cannot receive ETH.
        vm.prank(dev);
        chainvoice.setDevFeeReceiver(address(rejecting));

        // Fees accrue from a single payment and from a batch.
        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("recover-1"));
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("recover-2"));
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("recover-3"));
        vm.stopPrank();

        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + INITIAL_FEE}(0);

        uint256[] memory ids = new uint256[](2);
        ids[0] = 1;
        ids[1] = 2;
        vm.prank(bob);
        chainvoice.payInvoicesBatch{value: 2 ether + 2 * INITIAL_FEE}(ids);

        uint256 accrued = 3 * INITIAL_FEE;
        assertEq(chainvoice.accumulatedDevFees(), accrued);
        assertEq(address(chainvoice).balance, accrued);

        // Withdrawing reverts, and nothing is lost or moved.
        vm.expectRevert(Chainvoice.WithdrawFailed.selector);
        chainvoice.withdrawFees();
        assertEq(chainvoice.accumulatedDevFees(), accrued);
        assertEq(address(chainvoice).balance, accrued);
        assertEq(address(rejecting).balance, 0);

        // Nobody but the dev can repoint the receiver.
        vm.prank(alice);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.setDevFeeReceiver(working);

        // The dev fixes it, and the retry pays everything that accrued.
        vm.prank(dev);
        chainvoice.setDevFeeReceiver(working);

        chainvoice.withdrawFees();

        assertEq(working.balance, accrued);
        assertEq(chainvoice.accumulatedDevFees(), 0);
        assertEq(address(chainvoice).balance, 0);
        assertEq(address(rejecting).balance, 0);
    }

    function testWithdrawFees_FollowsReceiverChange() public {
        address newReceiver = address(0xBEEF);
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("withdraw3"));
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + INITIAL_FEE}(0);

        vm.prank(dev);
        chainvoice.setDevFeeReceiver(newReceiver);
        chainvoice.withdrawFees();

        assertEq(newReceiver.balance, INITIAL_FEE);
        assertEq(devFeeReceiver.balance, 0);
    }

    function testWithdrawFees_DevHandoverDoesNotMoveReceiver() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("withdraw4"));
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + INITIAL_FEE}(0);

        vm.prank(dev);
        chainvoice.proposeDev(charlie);
        vm.prank(charlie);
        chainvoice.acceptDev();

        chainvoice.withdrawFees();
        assertEq(devFeeReceiver.balance, INITIAL_FEE);
        assertEq(charlie.balance, 100 ether);
    }

    function testWithdrawFees_PaysVaultContractReceiver() public {
        VaultLikeReceiver vault = new VaultLikeReceiver();
        vm.prank(dev);
        chainvoice.setDevFeeReceiver(address(vault));

        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("vault"));
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + INITIAL_FEE}(0);

        chainvoice.withdrawFees();

        assertEq(address(vault).balance, INITIAL_FEE);
        assertEq(vault.deposits(), 1);
        assertEq(vault.total(), INITIAL_FEE);
        assertEq(chainvoice.accumulatedDevFees(), 0);
    }

    /* ------------------------------------------------------------ */
    /*                    DEV / DEV FEE RECEIVER                    */
    /* ------------------------------------------------------------ */

    function testConstructor_SetsDevAndReceiver() public {
        Chainvoice c = new Chainvoice(0.002 ether, address(0xABCD), address(0xDCBA));
        assertEq(c.devFee(), 0.002 ether);
        assertEq(c.dev(), address(0xABCD));
        assertEq(c.devFeeReceiver(), address(0xDCBA));
        assertEq(c.pendingDev(), address(0));
    }

    function testConstructor_EmitsInitialEvents() public {
        vm.expectEmit(true, true, false, false);
        emit DevFeeUpdated(0, 0.002 ether);
        vm.expectEmit(true, true, false, false);
        emit DevUpdated(address(0), address(0xABCD));
        vm.expectEmit(true, true, false, false);
        emit DevFeeReceiverUpdated(address(0), address(0xDCBA));
        new Chainvoice(0.002 ether, address(0xABCD), address(0xDCBA));
    }

    function testConstructor_RevertIfZeroFee() public {
        vm.expectRevert(Chainvoice.InvalidAmount.selector);
        new Chainvoice(0, dev, devFeeReceiver);
    }

    function testConstructor_RevertIfZeroDev() public {
        vm.expectRevert(Chainvoice.ZeroAddress.selector);
        new Chainvoice(INITIAL_FEE, address(0), devFeeReceiver);
    }

    function testConstructor_RevertIfZeroReceiver() public {
        vm.expectRevert(Chainvoice.ZeroAddress.selector);
        new Chainvoice(INITIAL_FEE, dev, address(0));
    }

    function testSetDevFee_ByDev() public {
        uint256 newFee = 0.001 ether;
        vm.expectEmit(true, true, false, false);
        emit DevFeeUpdated(INITIAL_FEE, newFee);
        vm.prank(dev);
        chainvoice.setDevFee(newFee);
        assertEq(chainvoice.devFee(), newFee);
    }

    function testSetDevFee_NoCap() public {
        vm.prank(dev);
        chainvoice.setDevFee(type(uint256).max);
        assertEq(chainvoice.devFee(), type(uint256).max);
    }

    function testSetDevFee_DevCanSetZero() public {
        vm.prank(dev);
        chainvoice.setDevFee(0);
        assertEq(chainvoice.devFee(), 0);
    }

    function testSetDevFeeReceiver_ByDev() public {
        address newReceiver = address(0xdead);
        vm.expectEmit(true, true, false, false);
        emit DevFeeReceiverUpdated(devFeeReceiver, newReceiver);
        vm.prank(dev);
        chainvoice.setDevFeeReceiver(newReceiver);
        assertEq(chainvoice.devFeeReceiver(), newReceiver);
    }

    function testSetDevFeeReceiver_RevertIfZero() public {
        vm.expectRevert(Chainvoice.ZeroAddress.selector);
        vm.prank(dev);
        chainvoice.setDevFeeReceiver(address(0));
    }

    function testNonDev_CannotCallDevFunctions() public {
        // The receiver, a random user and the deployer (this contract) all revert.
        address[3] memory callers = [devFeeReceiver, alice, address(this)];
        for (uint256 k = 0; k < callers.length; k++) {
            vm.startPrank(callers[k]);
            vm.expectRevert(Chainvoice.Unauthorized.selector);
            chainvoice.setDevFee(1);
            vm.expectRevert(Chainvoice.Unauthorized.selector);
            chainvoice.setDevFeeReceiver(alice);
            vm.expectRevert(Chainvoice.Unauthorized.selector);
            chainvoice.proposeDev(alice);
            vm.expectRevert(Chainvoice.Unauthorized.selector);
            chainvoice.cancelDevProposal();
            vm.stopPrank();
        }
    }

    // ----- two-step dev handover -----

    function testProposeDev_SetsPendingOnly() public {
        vm.expectEmit(true, true, false, false);
        emit DevProposed(dev, alice);
        vm.prank(dev);
        chainvoice.proposeDev(alice);

        assertEq(chainvoice.pendingDev(), alice);
        assertEq(chainvoice.dev(), dev);

        // The proposed address has no powers until it accepts.
        vm.prank(alice);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.setDevFee(1);
    }

    function testProposeDev_RevertIfZero() public {
        vm.expectRevert(Chainvoice.ZeroAddress.selector);
        vm.prank(dev);
        chainvoice.proposeDev(address(0));
    }

    function testAcceptDev_Succeeds() public {
        vm.prank(dev);
        chainvoice.proposeDev(alice);

        vm.expectEmit(true, true, false, false);
        emit DevUpdated(dev, alice);
        vm.prank(alice);
        chainvoice.acceptDev();

        assertEq(chainvoice.dev(), alice);
        assertEq(chainvoice.pendingDev(), address(0));

        // Old dev is out, new dev is in.
        vm.prank(dev);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.setDevFee(1);
        vm.prank(alice);
        chainvoice.setDevFee(1);
        assertEq(chainvoice.devFee(), 1);
    }

    function testAcceptDev_RevertIfWrongAddress() public {
        vm.prank(dev);
        chainvoice.proposeDev(alice);

        // Neither a stranger, the receiver nor the current dev can accept.
        address[3] memory callers = [bob, devFeeReceiver, dev];
        for (uint256 k = 0; k < callers.length; k++) {
            vm.prank(callers[k]);
            vm.expectRevert(Chainvoice.Unauthorized.selector);
            chainvoice.acceptDev();
        }
        assertEq(chainvoice.dev(), dev);
        assertEq(chainvoice.pendingDev(), alice);
    }

    function testAcceptDev_RevertIfNothingPending() public {
        vm.prank(alice);
        vm.expectRevert(Chainvoice.NoPendingDev.selector);
        chainvoice.acceptDev();

        // Not even the current dev can "accept" when nothing is pending.
        vm.prank(dev);
        vm.expectRevert(Chainvoice.NoPendingDev.selector);
        chainvoice.acceptDev();
    }

    function testAcceptDev_CannotBeReplayed() public {
        vm.prank(dev);
        chainvoice.proposeDev(alice);
        vm.prank(alice);
        chainvoice.acceptDev();

        vm.prank(alice);
        vm.expectRevert(Chainvoice.NoPendingDev.selector);
        chainvoice.acceptDev();
    }

    function testProposeDev_ReplacesPending() public {
        vm.startPrank(dev);
        chainvoice.proposeDev(alice);
        chainvoice.proposeDev(bob);
        vm.stopPrank();

        vm.prank(alice);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.acceptDev();

        vm.prank(bob);
        chainvoice.acceptDev();
        assertEq(chainvoice.dev(), bob);
    }

    // ----- cancelling a proposal -----

    function testCancelDevProposal_ClearsPending() public {
        vm.prank(dev);
        chainvoice.proposeDev(alice);

        vm.expectEmit(true, true, false, false);
        emit DevProposalCancelled(dev, alice);
        vm.prank(dev);
        chainvoice.cancelDevProposal();

        assertEq(chainvoice.pendingDev(), address(0));
        assertEq(chainvoice.dev(), dev);
    }

    function testCancelDevProposal_ProposedAddressCanNoLongerAccept() public {
        vm.prank(dev);
        chainvoice.proposeDev(alice);
        vm.prank(dev);
        chainvoice.cancelDevProposal();

        vm.prank(alice);
        vm.expectRevert(Chainvoice.NoPendingDev.selector);
        chainvoice.acceptDev();
        assertEq(chainvoice.dev(), dev);
    }

    function testCancelDevProposal_DevCanProposeAgain() public {
        vm.startPrank(dev);
        chainvoice.proposeDev(alice);
        chainvoice.cancelDevProposal();
        chainvoice.proposeDev(bob);
        vm.stopPrank();

        vm.prank(bob);
        chainvoice.acceptDev();
        assertEq(chainvoice.dev(), bob);
    }

    function testCancelDevProposal_RevertIfNothingPending() public {
        vm.prank(dev);
        vm.expectRevert(Chainvoice.NoPendingDev.selector);
        chainvoice.cancelDevProposal();
    }

    function testCancelDevProposal_RevertIfAlreadyCancelled() public {
        vm.startPrank(dev);
        chainvoice.proposeDev(alice);
        chainvoice.cancelDevProposal();
        vm.expectRevert(Chainvoice.NoPendingDev.selector);
        chainvoice.cancelDevProposal();
        vm.stopPrank();
    }

    function testCancelDevProposal_RevertIfNotDev() public {
        vm.prank(dev);
        chainvoice.proposeDev(alice);

        // A stranger, the receiver, the deployer and the proposed address itself
        // all revert, and the proposal survives.
        address[4] memory callers = [bob, devFeeReceiver, address(this), alice];
        for (uint256 k = 0; k < callers.length; k++) {
            vm.prank(callers[k]);
            vm.expectRevert(Chainvoice.Unauthorized.selector);
            chainvoice.cancelDevProposal();
        }
        assertEq(chainvoice.pendingDev(), alice);
    }

    function testProposeDev_PendingCannotActBeforeAcceptingReceiverChange() public {
        // A pending dev cannot change the receiver before accepting.
        vm.prank(dev);
        chainvoice.proposeDev(alice);
        vm.prank(alice);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.setDevFeeReceiver(alice);
    }

    function testAcceptDev_NewDevTakesOverEveryDevFunction() public {
        vm.prank(dev);
        chainvoice.proposeDev(alice);
        vm.prank(alice);
        chainvoice.acceptDev();

        // The old dev has lost every dev function.
        vm.startPrank(dev);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.setDevFeeReceiver(dev);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.proposeDev(dev);
        vm.stopPrank();

        // The new dev can change the receiver and hand the role on again.
        vm.startPrank(alice);
        chainvoice.setDevFeeReceiver(address(0xBEEF));
        chainvoice.proposeDev(bob);
        vm.stopPrank();
        assertEq(chainvoice.devFeeReceiver(), address(0xBEEF));

        vm.prank(bob);
        chainvoice.acceptDev();
        assertEq(chainvoice.dev(), bob);
    }

    function testFuzz_DevFunctions_OnlyDev(address caller, uint256 newDevFee, address newAddr) public {
        vm.assume(caller != dev);
        vm.assume(newAddr != address(0));

        vm.startPrank(caller);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.setDevFee(newDevFee);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.setDevFeeReceiver(newAddr);
        vm.expectRevert(Chainvoice.Unauthorized.selector);
        chainvoice.proposeDev(newAddr);
        vm.stopPrank();

        assertEq(chainvoice.devFee(), INITIAL_FEE);
        assertEq(chainvoice.devFeeReceiver(), devFeeReceiver);
        assertEq(chainvoice.pendingDev(), address(0));
    }

    /// Whatever fee the dev sets, a payment must include exactly that fee:
    /// the issuer gets the full amount and only the fee accrues to the dev.
    function testFuzz_PayInvoice_Native_ChargesExactDevFee(uint96 amount, uint96 newDevFee) public {
        vm.assume(amount > 0);
        vm.prank(dev);
        chainvoice.setDevFee(newDevFee);

        vm.prank(alice);
        chainvoice.createInvoice(bob, amount, address(0), keccak256("fuzz-fee"));

        uint256 due = uint256(amount) + newDevFee;
        vm.deal(bob, due + 1);

        vm.prank(bob);
        vm.expectRevert(Chainvoice.IncorrectPaymentAmount.selector);
        chainvoice.payInvoice{value: due + 1}(0);
        vm.prank(bob);
        vm.expectRevert(Chainvoice.IncorrectPaymentAmount.selector);
        chainvoice.payInvoice{value: due - 1}(0);

        uint256 aliceBefore = alice.balance;
        vm.prank(bob);
        chainvoice.payInvoice{value: due}(0);

        assertEq(alice.balance - aliceBefore, amount);
        assertEq(chainvoice.accumulatedDevFees(), newDevFee);
        assertEq(address(chainvoice).balance, newDevFee);
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

    /* ------------------------------------------------------------ */
    /*                       PAGINATION                             */
    /* ------------------------------------------------------------ */

    uint256 constant SEEDED = 25;

    /// @dev Alice sends SEEDED invoices to bob, and charlie sends one to alice
    ///      between each of them, so per-user positions differ from global ids:
    ///      alice's i-th sent (= bob's i-th received) invoice has id 2i, and
    ///      alice's i-th received invoice has id 2i + 1.
    function _seedInvoices() internal {
        for (uint256 i = 0; i < SEEDED; i++) {
            vm.prank(alice);
            chainvoice.createInvoice(bob, i + 1, address(0), keccak256(abi.encodePacked("sent", i)));
            vm.prank(charlie);
            chainvoice.createInvoice(alice, i + 1, address(0), keccak256(abi.encodePacked("recv", i)));
        }
    }

    /// @dev Checks page holds, newest first, the invoices `from` to `from + len`
    ///      positions back from the end of a list whose i-th invoice has id
    ///      2i + idOffset. Element i of the page is list position
    ///      SEEDED - 1 - from - i.
    function _assertPage(
        Chainvoice.InvoiceDetails[] memory page,
        uint256 from,
        uint256 len,
        uint256 idOffset
    ) internal pure {
        assertEq(page.length, len);
        for (uint256 i = 0; i < len; i++) {
            uint256 position = SEEDED - 1 - from - i;
            assertEq(page[i].id, 2 * position + idOffset);
            assertEq(page[i].amountDue, position + 1);
        }
    }

    function testGetSentInvoices_FirstPage() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getSentInvoices(alice, 0, 10);
        assertEq(total, SEEDED);
        _assertPage(page, 0, 10, 0);
    }

    function testGetSentInvoices_MiddlePage() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getSentInvoices(alice, 10, 10);
        assertEq(total, SEEDED);
        _assertPage(page, 10, 10, 0);
    }

    function testGetSentInvoices_LastPartialPage() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getSentInvoices(alice, 20, 10);
        assertEq(total, SEEDED);
        _assertPage(page, 20, 5, 0);
    }

    function testGetSentInvoices_OffsetEqualsTotal() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getSentInvoices(alice, SEEDED, 10);
        assertEq(total, SEEDED);
        assertEq(page.length, 0);
    }

    function testGetSentInvoices_OffsetBeyondTotal() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getSentInvoices(alice, SEEDED + 1, 10);
        assertEq(total, SEEDED);
        assertEq(page.length, 0);

        (page, total) = chainvoice.getSentInvoices(alice, type(uint256).max, 50);
        assertEq(total, SEEDED);
        assertEq(page.length, 0);
    }

    function testGetSentInvoices_MaxLimit() public {
        _seedInvoices();
        uint256 maxLimit = chainvoice.MAX_PAGE_LIMIT();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getSentInvoices(alice, 0, maxLimit);
        assertEq(total, SEEDED);
        _assertPage(page, 0, SEEDED, 0);
    }

    function testGetSentInvoices_RevertIfLimitZero() public {
        _seedInvoices();
        vm.expectRevert(Chainvoice.InvalidPageLimit.selector);
        chainvoice.getSentInvoices(alice, 0, 0);
    }

    function testGetSentInvoices_RevertIfLimitAboveMax() public {
        _seedInvoices();
        uint256 maxLimit = chainvoice.MAX_PAGE_LIMIT();
        vm.expectRevert(Chainvoice.InvalidPageLimit.selector);
        chainvoice.getSentInvoices(alice, 0, maxLimit + 1);
    }

    function testGetSentInvoices_NoInvoices() public view {
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getSentInvoices(bob, 0, 10);
        assertEq(total, 0);
        assertEq(page.length, 0);
    }

    function testGetSentInvoices_PagingReturnsEachInvoiceOnceNewestFirst() public {
        _seedInvoices();
        uint256 limit = 7;
        uint256 seen = 0;
        for (uint256 offset = 0; offset < SEEDED; offset += limit) {
            (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getSentInvoices(alice, offset, limit);
            assertEq(total, SEEDED);
            uint256 expectedLen = SEEDED - offset < limit ? SEEDED - offset : limit;
            _assertPage(page, offset, expectedLen, 0);
            seen += page.length;
        }
        assertEq(seen, SEEDED);
    }

    function testGetReceivedInvoices_FirstPage() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getReceivedInvoices(alice, 0, 10);
        assertEq(total, SEEDED);
        _assertPage(page, 0, 10, 1);
    }

    function testGetReceivedInvoices_MiddlePage() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getReceivedInvoices(alice, 10, 10);
        assertEq(total, SEEDED);
        _assertPage(page, 10, 10, 1);
    }

    function testGetReceivedInvoices_LastPartialPage() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getReceivedInvoices(alice, 20, 10);
        assertEq(total, SEEDED);
        _assertPage(page, 20, 5, 1);
    }

    function testGetReceivedInvoices_OffsetEqualsTotal() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getReceivedInvoices(alice, SEEDED, 10);
        assertEq(total, SEEDED);
        assertEq(page.length, 0);
    }

    function testGetReceivedInvoices_OffsetBeyondTotal() public {
        _seedInvoices();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getReceivedInvoices(alice, SEEDED + 1, 10);
        assertEq(total, SEEDED);
        assertEq(page.length, 0);

        (page, total) = chainvoice.getReceivedInvoices(alice, type(uint256).max, 50);
        assertEq(total, SEEDED);
        assertEq(page.length, 0);
    }

    function testGetReceivedInvoices_MaxLimit() public {
        _seedInvoices();
        uint256 maxLimit = chainvoice.MAX_PAGE_LIMIT();
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getReceivedInvoices(alice, 0, maxLimit);
        assertEq(total, SEEDED);
        _assertPage(page, 0, SEEDED, 1);
    }

    function testGetReceivedInvoices_RevertIfLimitZero() public {
        _seedInvoices();
        vm.expectRevert(Chainvoice.InvalidPageLimit.selector);
        chainvoice.getReceivedInvoices(alice, 0, 0);
    }

    function testGetReceivedInvoices_RevertIfLimitAboveMax() public {
        _seedInvoices();
        uint256 maxLimit = chainvoice.MAX_PAGE_LIMIT();
        vm.expectRevert(Chainvoice.InvalidPageLimit.selector);
        chainvoice.getReceivedInvoices(alice, 0, maxLimit + 1);
    }

    function testGetReceivedInvoices_NoInvoices() public view {
        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getReceivedInvoices(charlie, 0, 10);
        assertEq(total, 0);
        assertEq(page.length, 0);
    }

    function testGetReceivedInvoices_PagingReturnsEachInvoiceOnceNewestFirst() public {
        _seedInvoices();
        uint256 limit = 7;
        uint256 seen = 0;
        for (uint256 offset = 0; offset < SEEDED; offset += limit) {
            (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getReceivedInvoices(alice, offset, limit);
            assertEq(total, SEEDED);
            uint256 expectedLen = SEEDED - offset < limit ? SEEDED - offset : limit;
            _assertPage(page, offset, expectedLen, 1);
            seen += page.length;
        }
        assertEq(seen, SEEDED);
    }

    function testFuzz_GetSentInvoicesPage(uint256 offset, uint256 limit) public {
        _seedInvoices();
        offset = bound(offset, 0, SEEDED + 5);
        limit = bound(limit, 1, chainvoice.MAX_PAGE_LIMIT());

        (Chainvoice.InvoiceDetails[] memory page, uint256 total) = chainvoice.getSentInvoices(alice, offset, limit);
        assertEq(total, SEEDED);

        uint256 expectedLen = offset >= SEEDED ? 0 : (SEEDED - offset < limit ? SEEDED - offset : limit);
        _assertPage(page, offset, expectedLen, 0);
    }

    /* ------------------------------------------------------------ */
    /*                       ERC20 OPERATIONS                       */
    /* ------------------------------------------------------------ */

    function testCreateInvoicesBatch_ValidToken() public {
        address token = address(new ValidCreationToken());
        address[] memory tos = new address[](1);
        uint256[] memory amounts = new uint256[](1);
        bytes32[] memory hashes = new bytes32[](1);
        tos[0] = bob;
        amounts[0] = 1 ether;
        hashes[0] = keccak256("batch-token");

        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, token, keccak256("single-token"));
        vm.prank(alice);
        chainvoice.createInvoicesBatch(tos, amounts, token, hashes);

        (Chainvoice.InvoiceDetails[] memory sent, uint256 total) = chainvoice.getSentInvoices(alice, 0, 10);
        assertEq(total, 2);
        assertEq(sent.length, 2);
        assertEq(sent[0].tokenAddress, token);
        assertEq(sent[1].tokenAddress, token);
    }

    function testCreateInvoicesBatch_RejectsEmptyReturnToken() public {
        _assertTokenRejectedForSingleAndBatch(address(new EmptyReturnToken()), Chainvoice.InvalidToken.selector);
    }

    function testCreateInvoicesBatch_RejectsRevertingBalanceOf() public {
        _assertTokenRejectedForSingleAndBatch(address(new RevertingBalanceToken()), Chainvoice.InvalidToken.selector);
    }

    function testCreateInvoicesBatch_RejectsEmptyAllowance() public {
        _assertTokenRejectedForSingleAndBatch(address(new EmptyAllowanceToken()), Chainvoice.InvalidToken.selector);
    }

    function testCreateInvoicesBatch_RejectsRevertingAllowance() public {
        _assertTokenRejectedForSingleAndBatch(address(new RevertingAllowanceToken()), Chainvoice.InvalidToken.selector);
    }

    function testCreateInvoicesBatch_RejectsEOA() public {
        _assertTokenRejectedForSingleAndBatch(address(0xBEEF), Chainvoice.NotContract.selector);
    }

    function testCreateInvoicesBatch_RejectsShortBalanceReturn() public {
        _assertTokenRejectedForSingleAndBatch(address(new ShortBalanceToken()), Chainvoice.InvalidToken.selector);
    }

    function _assertTokenRejectedForSingleAndBatch(address token, bytes4 expectedError) private {
        address[] memory tos = new address[](1);
        uint256[] memory amounts = new uint256[](1);
        bytes32[] memory hashes = new bytes32[](1);
        tos[0] = bob;
        amounts[0] = 1 ether;
        hashes[0] = keccak256("invalid-token");

        vm.expectRevert(expectedError);
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, token, hashes[0]);

        vm.expectRevert(expectedError);
        vm.prank(alice);
        chainvoice.createInvoicesBatch(tos, amounts, token, hashes);

        (Chainvoice.InvoiceDetails[] memory sent, uint256 total) = chainvoice.getSentInvoices(alice, 0, 10);
        assertEq(total, 0);
        assertEq(sent.length, 0);
    }

    function testCreateInvoice_ERC20() public {
        MockERC20 token = new MockERC20();
        
        vm.prank(alice);
        chainvoice.createInvoice(
            bob,
            100 * 10**18,
            address(token),
            keccak256("erc20Data")
        );

        Chainvoice.InvoiceDetails memory inv = chainvoice.getInvoice(0);
        assertEq(inv.from, alice);
        assertEq(inv.to, bob);
        assertEq(inv.amountDue, 100 * 10**18);
        assertEq(inv.tokenAddress, address(token));
        assertFalse(inv.isPaid);
    }

    function testPayInvoice_ERC20() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 100 * 10**18);
        
        vm.prank(alice);
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("erc20Data"));

        uint256 fee = chainvoice.devFee();

        vm.startPrank(bob);
        token.approve(address(chainvoice), 100 * 10**18);
        chainvoice.payInvoice{value: fee}(0);
        vm.stopPrank();

        Chainvoice.InvoiceDetails memory inv = chainvoice.getInvoice(0);
        assertTrue(inv.isPaid);
        assertEq(token.balanceOf(bob), 0);
        assertEq(token.balanceOf(alice), 100 * 10**18);
        assertEq(chainvoice.accumulatedDevFees(), fee);
    }

    function testPayInvoice_ERC20_RevertInsufficientBalance() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 50 * 10**18); // Insufficient balance

        vm.prank(alice);
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("erc20Data"));

        uint256 fee = chainvoice.devFee();

        vm.startPrank(bob);
        token.approve(address(chainvoice), 100 * 10**18); // Sufficient allowance
        vm.expectRevert("SafeERC20: ERC20 operation did not succeed");
        chainvoice.payInvoice{value: fee}(0);
        vm.stopPrank();

        Chainvoice.InvoiceDetails memory inv = chainvoice.getInvoice(0);
        assertFalse(inv.isPaid);
        assertEq(chainvoice.accumulatedDevFees(), 0);
    }

    function testPayInvoice_ERC20_RevertInsufficientAllowance() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 100 * 10**18);

        vm.prank(alice);
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("erc20Data"));

        uint256 fee = chainvoice.devFee();

        vm.prank(bob);
        vm.expectRevert(Chainvoice.InsufficientAllowance.selector);
        chainvoice.payInvoice{value: fee}(0);
    }

    function testPayInvoice_ERC20_RevertFeeMustBeNative() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 100 * 10**18);

        vm.prank(alice);
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("erc20Data"));

        vm.startPrank(bob);
        token.approve(address(chainvoice), 100 * 10**18);
        vm.expectRevert(Chainvoice.FeeMustBeNative.selector);
        chainvoice.payInvoice(0); // value: 0
        vm.stopPrank();
    }

    function testPayInvoicesBatch_ERC20() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 300 * 10**18);

        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("b1"));
        chainvoice.createInvoice(bob, 200 * 10**18, address(token), keccak256("b2"));
        vm.stopPrank();

        uint256 fee = chainvoice.devFee();
        uint256 totalFee = fee * 2;

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;

        vm.startPrank(bob);
        token.approve(address(chainvoice), 300 * 10**18);
        chainvoice.payInvoicesBatch{value: totalFee}(ids);
        vm.stopPrank();

        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertTrue(chainvoice.getInvoice(1).isPaid);
        assertEq(token.balanceOf(bob), 0);
        assertEq(token.balanceOf(alice), 300 * 10**18);
        assertEq(chainvoice.accumulatedDevFees(), totalFee);
    }

    function testPayInvoicesBatch_ERC20_RevertInsufficientBalance() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 150 * 10**18); // Insufficient for both (100 + 200 = 300)

        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("b1"));
        chainvoice.createInvoice(bob, 200 * 10**18, address(token), keccak256("b2"));
        vm.stopPrank();

        uint256 fee = chainvoice.devFee();
        uint256 totalFee = fee * 2;

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;

        vm.startPrank(bob);
        token.approve(address(chainvoice), 300 * 10**18); // Sufficient allowance
        vm.expectRevert("SafeERC20: ERC20 operation did not succeed");
        chainvoice.payInvoicesBatch{value: totalFee}(ids);
        vm.stopPrank();

        assertFalse(chainvoice.getInvoice(0).isPaid);
        assertFalse(chainvoice.getInvoice(1).isPaid);
        assertEq(chainvoice.accumulatedDevFees(), 0);
    }

    function testPayInvoicesBatch_ERC20_RevertInsufficientAllowance() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 300 * 10**18);

        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("b1"));
        chainvoice.createInvoice(bob, 200 * 10**18, address(token), keccak256("b2"));
        vm.stopPrank();

        uint256 fee = chainvoice.devFee();
        uint256 totalFee = fee * 2;

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;

        vm.startPrank(bob);
        // No allowance given
        vm.expectRevert(Chainvoice.InsufficientAllowance.selector);
        chainvoice.payInvoicesBatch{value: totalFee}(ids);
        vm.stopPrank();

        assertFalse(chainvoice.getInvoice(0).isPaid);
        assertFalse(chainvoice.getInvoice(1).isPaid);
        assertEq(chainvoice.accumulatedDevFees(), 0);
    }

    function testPayInvoicesBatch_ERC20_RevertIncorrectNativeValue() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 300 * 10**18);

        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("b1"));
        chainvoice.createInvoice(bob, 200 * 10**18, address(token), keccak256("b2"));
        vm.stopPrank();

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;

        vm.startPrank(bob);
        token.approve(address(chainvoice), 300 * 10**18);
        // Send incorrect native fee (0 instead of totalFee)
        vm.expectRevert(Chainvoice.IncorrectNativeValue.selector);
        chainvoice.payInvoicesBatch{value: 0}(ids);
        vm.stopPrank();

        assertFalse(chainvoice.getInvoice(0).isPaid);
        assertFalse(chainvoice.getInvoice(1).isPaid);
        assertEq(chainvoice.accumulatedDevFees(), 0);

    }

    /* ------------------------------------------------------------ */
    /*                 NON-STANDARD ERC-20 TOKENS                   */
    /* ------------------------------------------------------------ */

    function testPayInvoice_NoReturnToken_Succeeds() public {
        MockNoReturnERC20 token = new MockNoReturnERC20();
        token.mint(bob, 100e6);

        vm.prank(alice);
        chainvoice.createInvoice(bob, 100e6, address(token), keccak256("usdt"));

        uint256 fee = chainvoice.devFee();
        vm.startPrank(bob);
        token.approve(address(chainvoice), 100e6);
        chainvoice.payInvoice{value: fee}(0);
        vm.stopPrank();

        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertEq(token.balanceOf(alice), 100e6);
        assertEq(token.balanceOf(bob), 0);
    }

    function testPayInvoicesBatch_NoReturnToken_Succeeds() public {
        MockNoReturnERC20 token = new MockNoReturnERC20();
        token.mint(bob, 300e6);

        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 100e6, address(token), keccak256("u1"));
        chainvoice.createInvoice(bob, 200e6, address(token), keccak256("u2"));
        vm.stopPrank();

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;

        uint256 fee = chainvoice.devFee();
        vm.startPrank(bob);
        token.approve(address(chainvoice), 300e6);
        chainvoice.payInvoicesBatch{value: fee * 2}(ids);
        vm.stopPrank();

        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertTrue(chainvoice.getInvoice(1).isPaid);
        assertEq(token.balanceOf(alice), 300e6);
    }

    function testPayInvoice_NoReturnToken_RevertingTransferRollsBack() public {
        MockNoReturnERC20 token = new MockNoReturnERC20();
        token.mint(bob, 50e6); // short of the 100e6 due

        vm.prank(alice);
        chainvoice.createInvoice(bob, 100e6, address(token), keccak256("usdt"));

        uint256 fee = chainvoice.devFee();
        vm.startPrank(bob);
        token.approve(address(chainvoice), 100e6);
        vm.expectRevert("balance");
        chainvoice.payInvoice{value: fee}(0);
        vm.stopPrank();

        assertFalse(chainvoice.getInvoice(0).isPaid);
        assertEq(chainvoice.accumulatedDevFees(), 0);
    }

    function testPayInvoice_FeeOnTransferToken_RevertShortfall() public {
        MockFeeOnTransferERC20 token = new MockFeeOnTransferERC20();
        token.mint(bob, 100 ether);

        vm.prank(alice);
        chainvoice.createInvoice(bob, 100 ether, address(token), keccak256("fot"));

        uint256 fee = chainvoice.devFee();
        vm.startPrank(bob);
        token.approve(address(chainvoice), 100 ether);
        vm.expectRevert(Chainvoice.TokenAmountShortfall.selector);
        chainvoice.payInvoice{value: fee}(0);
        vm.stopPrank();

        assertFalse(chainvoice.getInvoice(0).isPaid);
        assertEq(token.balanceOf(alice), 0);
        assertEq(chainvoice.accumulatedDevFees(), 0);
    }

    function testPayInvoicesBatch_FeeOnTransferToken_RevertShortfall() public {
        MockFeeOnTransferERC20 token = new MockFeeOnTransferERC20();
        token.mint(bob, 200 ether + 50);

        vm.startPrank(alice);
        // The first amount is too small to lose anything to the 1% burn, so the
        // first transfer passes and the shortfall hits the second one.
        chainvoice.createInvoice(bob, 50, address(token), keccak256("f1"));
        chainvoice.createInvoice(bob, 200 ether, address(token), keccak256("f2"));
        vm.stopPrank();

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;

        uint256 fee = chainvoice.devFee();
        vm.startPrank(bob);
        token.approve(address(chainvoice), 200 ether + 50);
        vm.expectRevert(Chainvoice.TokenAmountShortfall.selector);
        chainvoice.payInvoicesBatch{value: fee * 2}(ids);
        vm.stopPrank();

        assertFalse(chainvoice.getInvoice(0).isPaid);
        assertFalse(chainvoice.getInvoice(1).isPaid);
        assertEq(token.balanceOf(alice), 0);
        assertEq(chainvoice.accumulatedDevFees(), 0);
    }

    /* ------------------------------------------------------------ */
    /*                      PAYMENT STATUS                          */
    /* ------------------------------------------------------------ */

    function testGetPaymentStatus_PaidInvoiceCannotBePaid() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("n"));

        uint256 fee = chainvoice.devFee();
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);

        (bool canPay, , ) = chainvoice.getPaymentStatus(0, bob);
        assertFalse(canPay);
    }

    function testGetPaymentStatus_ERC20_RequiresNativeFee() public {
        MockERC20 token = new MockERC20();
        address poor = address(0xD00D);
        token.mint(poor, 100 ether);

        vm.prank(alice);
        chainvoice.createInvoice(poor, 100 ether, address(token), keccak256("t"));

        vm.prank(poor);
        token.approve(address(chainvoice), 100 ether);

        // Tokens and allowance cover the invoice, but there is no ETH for the fee.
        (bool canPay, , ) = chainvoice.getPaymentStatus(0, poor);
        assertFalse(canPay);

        vm.deal(poor, chainvoice.devFee());
        (canPay, , ) = chainvoice.getPaymentStatus(0, poor);
        assertTrue(canPay);
    }

    /* ------------------------------------------------------------ */
    /*                         REENTRANCY                           */
    /* ------------------------------------------------------------ */

    function _reentrancyError() private pure returns (bytes memory) {
        return abi.encodeWithSelector(Chainvoice.Reentrancy.selector);
    }

    function testPayInvoice_ERC20_TokenReentryReverts() public {
        ReentrantERC20 token = new ReentrantERC20();
        token.mint(bob, 2 ether);

        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(token), keccak256("a"));
        chainvoice.createInvoice(bob, 1 ether, address(token), keccak256("b"));
        vm.stopPrank();

        token.arm(chainvoice, abi.encodeCall(Chainvoice.payInvoice, (1)));

        uint256 fee = chainvoice.devFee();
        vm.startPrank(bob);
        token.approve(address(chainvoice), 2 ether);
        chainvoice.payInvoice{value: fee}(0);
        vm.stopPrank();

        assertEq(token.reentryError(), _reentrancyError());
        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertFalse(chainvoice.getInvoice(1).isPaid);
        assertEq(token.balanceOf(alice), 1 ether);
    }

    function testPayInvoicesBatch_ERC20_TokenReentryReverts() public {
        ReentrantERC20 token = new ReentrantERC20();
        token.mint(bob, 3 ether);

        vm.startPrank(alice);
        for (uint256 i = 0; i < 3; i++) {
            chainvoice.createInvoice(bob, 1 ether, address(token), keccak256(abi.encode(i)));
        }
        vm.stopPrank();

        uint256[] memory reentryIds = new uint256[](1);
        reentryIds[0] = 2;
        token.arm(chainvoice, abi.encodeCall(Chainvoice.payInvoicesBatch, (reentryIds)));

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;
        uint256 fee = chainvoice.devFee();
        vm.startPrank(bob);
        token.approve(address(chainvoice), 3 ether);
        chainvoice.payInvoicesBatch{value: fee * 2}(ids);
        vm.stopPrank();

        assertEq(token.reentryError(), _reentrancyError());
        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertTrue(chainvoice.getInvoice(1).isPaid);
        assertFalse(chainvoice.getInvoice(2).isPaid);
        assertEq(token.balanceOf(alice), 2 ether);
    }

    function testPayInvoice_Native_IssuerReentryReverts() public {
        ReentrantIssuer issuer = new ReentrantIssuer(chainvoice);
        issuer.createInvoice(bob, 1 ether);
        issuer.createInvoice(bob, 1 ether);
        issuer.arm(abi.encodeCall(Chainvoice.payInvoice, (1)), 0);

        uint256 fee = chainvoice.devFee();
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);

        assertEq(issuer.reentryError(), _reentrancyError());
        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertFalse(chainvoice.getInvoice(1).isPaid);
        assertEq(address(issuer).balance, 1 ether);
    }

    function testPayInvoicesBatch_Native_IssuerReentryReverts() public {
        ReentrantIssuer issuer = new ReentrantIssuer(chainvoice);
        issuer.createInvoice(bob, 1 ether);
        issuer.createInvoice(bob, 1 ether);

        uint256[] memory reentryIds = new uint256[](1);
        reentryIds[0] = 1;
        issuer.arm(abi.encodeCall(Chainvoice.payInvoicesBatch, (reentryIds)), 0);

        uint256[] memory ids = new uint256[](1);
        ids[0] = 0;
        uint256 fee = chainvoice.devFee();
        vm.prank(bob);
        chainvoice.payInvoicesBatch{value: 1 ether + fee}(ids);

        assertEq(issuer.reentryError(), _reentrancyError());
        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertFalse(chainvoice.getInvoice(1).isPaid);
        assertEq(address(issuer).balance, 1 ether);
    }

    /// The re-entrant caller here is the authorized payer of the nested invoice
    /// and forwards the exact amount, so only the reentrancy guard can stop it.
    function testPayInvoice_Native_AuthorizedFundedReentryReverts() public {
        ReentrantIssuer issuer = new ReentrantIssuer(chainvoice);
        issuer.createInvoice(bob, 2 ether);

        vm.prank(alice);
        chainvoice.createInvoice(address(issuer), 1 ether, address(0), keccak256("nested"));

        uint256 fee = chainvoice.devFee();
        issuer.arm(abi.encodeCall(Chainvoice.payInvoice, (1)), 1 ether + fee);

        vm.prank(bob);
        chainvoice.payInvoice{value: 2 ether + fee}(0);

        assertEq(issuer.reentryError(), _reentrancyError());
        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertFalse(chainvoice.getInvoice(1).isPaid);
        assertEq(address(issuer).balance, 2 ether);
    }

    /* ------------------------------------------------------------ */
    /*                    SETTLEMENT AND ADMIN REVERTS              */
    /* ------------------------------------------------------------ */

    function testPayInvoice_RevertIfCancelled() public {
        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("data"));
        chainvoice.cancelInvoice(0);
        vm.stopPrank();

        uint256 fee = chainvoice.devFee();
        vm.expectRevert(Chainvoice.InvoiceCancelledError.selector);
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);
    }

    function testPayInvoice_RevertIfAlreadyPaid() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("data"));

        uint256 fee = chainvoice.devFee();
        vm.startPrank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);
        vm.expectRevert(Chainvoice.InvoiceAlreadyPaid.selector);
        chainvoice.payInvoice{value: 1 ether + fee}(0);
        vm.stopPrank();
    }

    function testCancelInvoice_RevertIfNotCreator() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("data"));

        vm.expectRevert(Chainvoice.NotInvoiceCreator.selector);
        vm.prank(bob);
        chainvoice.cancelInvoice(0);
    }

    function testCancelInvoice_RevertIfPaid() public {
        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("data"));

        uint256 fee = chainvoice.devFee();
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + fee}(0);

        vm.expectRevert(Chainvoice.InvoiceNotCancellable.selector);
        vm.prank(alice);
        chainvoice.cancelInvoice(0);
    }

    function testPayInvoicesBatch_RevertOnMixedTokens() public {
        MockERC20 token = new MockERC20();

        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("native"));
        chainvoice.createInvoice(bob, 1 ether, address(token), keccak256("token"));
        vm.stopPrank();

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;
        uint256 fee = chainvoice.devFee();
        vm.expectRevert(Chainvoice.MixedTokenBatch.selector);
        vm.prank(bob);
        chainvoice.payInvoicesBatch{value: 1 ether + fee * 2}(ids);
    }

    function testWithdrawFees_RevertIfNoFees() public {
        vm.expectRevert(Chainvoice.NoFeesAvailable.selector);
        chainvoice.withdrawFees();
    }

    /* ------------------------------------------------------------ */
    /*                  FEE CHARGED ON PAYMENT PATHS                 */
    /* ------------------------------------------------------------ */

    uint256 constant NEW_FEE = 0.01 ether;

    function _setNewFee() private {
        vm.prank(dev);
        chainvoice.setDevFee(NEW_FEE);
    }

    function testPayInvoice_Native_ChargesInitialThenNewFee() public {
        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("n1"));
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("n2"));
        vm.stopPrank();

        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + INITIAL_FEE}(0);
        assertEq(chainvoice.accumulatedDevFees(), INITIAL_FEE);

        _setNewFee();

        // The old fee no longer pays.
        vm.prank(bob);
        vm.expectRevert(Chainvoice.IncorrectPaymentAmount.selector);
        chainvoice.payInvoice{value: 1 ether + INITIAL_FEE}(1);

        uint256 aliceBefore = alice.balance;
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether + NEW_FEE}(1);
        assertEq(alice.balance - aliceBefore, 1 ether);
        assertEq(chainvoice.accumulatedDevFees(), INITIAL_FEE + NEW_FEE);

        chainvoice.withdrawFees();
        assertEq(devFeeReceiver.balance, INITIAL_FEE + NEW_FEE);
    }

    function testPayInvoice_ERC20_ChargesInitialThenNewNativeFee() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 200 * 10**18);

        vm.startPrank(alice);
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("e1"));
        chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256("e2"));
        vm.stopPrank();

        vm.startPrank(bob);
        token.approve(address(chainvoice), 200 * 10**18);
        chainvoice.payInvoice{value: INITIAL_FEE}(0);
        vm.stopPrank();
        assertEq(chainvoice.accumulatedDevFees(), INITIAL_FEE);

        _setNewFee();

        vm.prank(bob);
        vm.expectRevert(Chainvoice.FeeMustBeNative.selector);
        chainvoice.payInvoice{value: INITIAL_FEE}(1);

        vm.prank(bob);
        chainvoice.payInvoice{value: NEW_FEE}(1);
        assertEq(token.balanceOf(alice), 200 * 10**18);
        assertEq(chainvoice.accumulatedDevFees(), INITIAL_FEE + NEW_FEE);
    }

    function testPayInvoicesBatch_Native_ChargesInitialThenNewFee() public {
        vm.startPrank(alice);
        for (uint256 n = 0; n < 4; n++) {
            chainvoice.createInvoice(bob, 1 ether, address(0), keccak256(abi.encode("bn", n)));
        }
        vm.stopPrank();

        uint256[] memory first = new uint256[](2);
        first[0] = 0;
        first[1] = 1;
        vm.prank(bob);
        chainvoice.payInvoicesBatch{value: 2 ether + 2 * INITIAL_FEE}(first);
        assertEq(chainvoice.accumulatedDevFees(), 2 * INITIAL_FEE);

        _setNewFee();

        uint256[] memory second = new uint256[](2);
        second[0] = 2;
        second[1] = 3;
        vm.prank(bob);
        vm.expectRevert(Chainvoice.IncorrectNativeValue.selector);
        chainvoice.payInvoicesBatch{value: 2 ether + 2 * INITIAL_FEE}(second);

        vm.prank(bob);
        chainvoice.payInvoicesBatch{value: 2 ether + 2 * NEW_FEE}(second);
        assertEq(chainvoice.accumulatedDevFees(), 2 * INITIAL_FEE + 2 * NEW_FEE);

        chainvoice.withdrawFees();
        assertEq(devFeeReceiver.balance, 2 * INITIAL_FEE + 2 * NEW_FEE);
    }

    function testPayInvoicesBatch_ERC20_ChargesInitialThenNewFee() public {
        MockERC20 token = new MockERC20();
        token.mint(bob, 400 * 10**18);

        vm.startPrank(alice);
        for (uint256 n = 0; n < 4; n++) {
            chainvoice.createInvoice(bob, 100 * 10**18, address(token), keccak256(abi.encode("be", n)));
        }
        vm.stopPrank();

        vm.prank(bob);
        token.approve(address(chainvoice), 400 * 10**18);

        uint256[] memory first = new uint256[](2);
        first[0] = 0;
        first[1] = 1;
        vm.prank(bob);
        chainvoice.payInvoicesBatch{value: 2 * INITIAL_FEE}(first);
        assertEq(chainvoice.accumulatedDevFees(), 2 * INITIAL_FEE);

        _setNewFee();

        uint256[] memory second = new uint256[](2);
        second[0] = 2;
        second[1] = 3;
        vm.prank(bob);
        vm.expectRevert(Chainvoice.IncorrectNativeValue.selector);
        chainvoice.payInvoicesBatch{value: 2 * INITIAL_FEE}(second);

        vm.prank(bob);
        chainvoice.payInvoicesBatch{value: 2 * NEW_FEE}(second);
        assertEq(token.balanceOf(alice), 400 * 10**18);
        assertEq(chainvoice.accumulatedDevFees(), 2 * INITIAL_FEE + 2 * NEW_FEE);
    }

    function testPayInvoice_ZeroFeeSetByDev() public {
        vm.prank(dev);
        chainvoice.setDevFee(0);

        vm.prank(alice);
        chainvoice.createInvoice(bob, 1 ether, address(0), keccak256("free"));
        vm.prank(bob);
        chainvoice.payInvoice{value: 1 ether}(0);
        assertEq(chainvoice.accumulatedDevFees(), 0);
    }
}
