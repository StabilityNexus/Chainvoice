// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Chainvoice} from "../src/Chainvoice.sol";

contract TransferBehaviorERC20 {
    error TransferReverted();

    enum Behavior {
        ReturnTrue,
        ReturnFalse,
        NoReturn,
        RevertCustom,
        RevertString,
        RevertEmpty,
        Return31Bytes,
        ReturnNonCanonicalBool,
        Return64Bytes
    }

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    Behavior private immutable BEHAVIOR;
    uint256 private immutable FAIL_ON_TRANSFER;
    uint256 private transferCalls;

    constructor(Behavior behavior, uint256 failOnTransfer) {
        BEHAVIOR = behavior;
        FAIL_ON_TRANSFER = failOnTransfer;
    }

    function mint(address account, uint256 amount) external {
        balanceOf[account] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external {
        transferCalls++;

        if (BEHAVIOR == Behavior.ReturnFalse && (FAIL_ON_TRANSFER == 0 || transferCalls == FAIL_ON_TRANSFER)) {
            assembly {
                mstore(0, 0)
                return(0, 32)
            }
        }
        if (BEHAVIOR == Behavior.RevertCustom) revert TransferReverted();
        if (BEHAVIOR == Behavior.RevertString) revert("transfer reverted");
        if (BEHAVIOR == Behavior.RevertEmpty) {
            assembly {
                revert(0, 0)
            }
        }

        uint256 approved = allowance[sender][msg.sender];
        require(approved >= amount, "insufficient allowance");
        require(balanceOf[sender] >= amount, "insufficient balance");

        allowance[sender][msg.sender] = approved - amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;

        if (BEHAVIOR == Behavior.NoReturn) return;
        if (BEHAVIOR == Behavior.Return31Bytes) {
            assembly {
                mstore(0, 1)
                return(1, 31)
            }
        }
        if (BEHAVIOR == Behavior.ReturnNonCanonicalBool) {
            assembly {
                mstore(0, 2)
                return(0, 32)
            }
        }
        if (BEHAVIOR == Behavior.Return64Bytes) {
            assembly {
                mstore(0, 1)
                mstore(32, 0x1234)
                return(0, 64)
            }
        }

        assembly {
            mstore(0, 1)
            return(0, 32)
        }
    }
}

contract NoReturnERC20Test is Test {
    Chainvoice private chainvoice;

    address private issuer = address(0xA11CE);
    address private secondIssuer = address(0xBEEF);
    address private payer = address(0xB0B);

    function setUp() public {
        chainvoice = new Chainvoice();
        vm.deal(payer, 1 ether);
    }

    function testPayInvoiceSupportsNoReturnToken() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.NoReturn, 0, 1 ether);
        _createInvoice(address(token), 1 ether);
        _approve(token, 1 ether);

        _payInvoice();

        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertEq(token.balanceOf(issuer), 1 ether);
        assertEq(token.balanceOf(payer), 0);
        assertEq(chainvoice.accumulatedFees(), chainvoice.fee());
    }

    function testPayInvoicesBatchSupportsNoReturnToken() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.NoReturn, 0, 3 ether);
        uint256[] memory invoiceIds = _createBatch(address(token));
        _approve(token, 3 ether);

        _payInvoicesBatch(invoiceIds);

        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertTrue(chainvoice.getInvoice(1).isPaid);
        assertEq(token.balanceOf(issuer), 1 ether);
        assertEq(token.balanceOf(secondIssuer), 2 ether);
        assertEq(token.balanceOf(payer), 0);
        assertEq(chainvoice.accumulatedFees(), chainvoice.fee() * 2);
    }

    function testPayInvoiceSupportsTrueReturnValue() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.ReturnTrue, 0, 1 ether);
        _createInvoice(address(token), 1 ether);
        _approve(token, 1 ether);

        _payInvoice();

        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertEq(token.balanceOf(issuer), 1 ether);
    }

    function testPayInvoicesBatchSupportsTrueReturnValue() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.ReturnTrue, 0, 3 ether);
        uint256[] memory invoiceIds = _createBatch(address(token));
        _approve(token, 3 ether);

        _payInvoicesBatch(invoiceIds);

        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertTrue(chainvoice.getInvoice(1).isPaid);
        assertEq(token.balanceOf(issuer), 1 ether);
        assertEq(token.balanceOf(secondIssuer), 2 ether);
    }

    function testPayInvoiceRejectsFalseReturnValue() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.ReturnFalse, 0, 1 ether);
        _createInvoice(address(token), 1 ether);
        _approve(token, 1 ether);

        _expectPayInvoiceRevert(abi.encodeWithSelector(Chainvoice.TokenTransferFailed.selector));

        _assertUnpaid(token, 1 ether);
    }

    function testPayInvoicesBatchRollsBackWhenSecondTransferReturnsFalse() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.ReturnFalse, 2, 3 ether);
        uint256[] memory invoiceIds = _createBatch(address(token));
        _approve(token, 3 ether);

        _expectPayInvoicesBatchRevert(invoiceIds, abi.encodeWithSelector(Chainvoice.TokenTransferFailed.selector));

        assertFalse(chainvoice.getInvoice(0).isPaid);
        assertFalse(chainvoice.getInvoice(1).isPaid);
        assertEq(chainvoice.accumulatedFees(), 0);
        assertEq(token.balanceOf(issuer), 0);
        assertEq(token.balanceOf(secondIssuer), 0);
        assertEq(token.balanceOf(payer), 3 ether);
        assertEq(token.allowance(payer, address(chainvoice)), 3 ether);
    }

    function testPayInvoiceBubblesCustomError() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.RevertCustom, 0, 1 ether);
        _createInvoice(address(token), 1 ether);
        _approve(token, 1 ether);

        _expectPayInvoiceRevert(abi.encodeWithSelector(TransferBehaviorERC20.TransferReverted.selector));

        _assertUnpaid(token, 1 ether);
    }

    function testPayInvoiceBubblesRevertString() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.RevertString, 0, 1 ether);
        _createInvoice(address(token), 1 ether);
        _approve(token, 1 ether);

        _expectPayInvoiceRevert(abi.encodeWithSignature("Error(string)", "transfer reverted"));

        _assertUnpaid(token, 1 ether);
    }

    function testPayInvoiceBubblesEmptyRevert() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.RevertEmpty, 0, 1 ether);
        _createInvoice(address(token), 1 ether);
        _approve(token, 1 ether);

        (bool success, bytes memory returnData) = _callPayInvoice();

        assertFalse(success);
        assertEq(returnData.length, 0);
        _assertUnpaid(token, 1 ether);
    }

    function testPayInvoiceRejects31ByteReturnData() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.Return31Bytes, 0, 1 ether);
        _createInvoice(address(token), 1 ether);
        _approve(token, 1 ether);

        _expectPayInvoiceRevert(abi.encodeWithSelector(Chainvoice.TokenTransferFailed.selector));

        _assertUnpaid(token, 1 ether);
    }

    function testPayInvoiceRejectsNonCanonicalBool() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.ReturnNonCanonicalBool, 0, 1 ether);
        _createInvoice(address(token), 1 ether);
        _approve(token, 1 ether);

        _expectPayInvoiceRevert(abi.encodeWithSelector(Chainvoice.TokenTransferFailed.selector));

        _assertUnpaid(token, 1 ether);
    }

    function testPayInvoiceAccepts64ByteReturnDataStartingWithTrue() public {
        TransferBehaviorERC20 token = _token(TransferBehaviorERC20.Behavior.Return64Bytes, 0, 1 ether);
        _createInvoice(address(token), 1 ether);
        _approve(token, 1 ether);

        _payInvoice();

        assertTrue(chainvoice.getInvoice(0).isPaid);
        assertEq(token.balanceOf(issuer), 1 ether);
    }

    function testCreateInvoiceRejectsNonContractTokenAddress() public {
        address nonContractToken = address(0xCAFE);
        vm.expectRevert(Chainvoice.NotContract.selector);
        _createInvoice(nonContractToken, 1 ether);
    }

    function _token(TransferBehaviorERC20.Behavior behavior, uint256 failOnTransfer, uint256 balance)
        private
        returns (TransferBehaviorERC20 token)
    {
        token = new TransferBehaviorERC20(behavior, failOnTransfer);
        token.mint(payer, balance);
    }

    function _createInvoice(address tokenAddress, uint256 amount) private {
        vm.prank(issuer);
        chainvoice.createInvoice(payer, amount, tokenAddress, keccak256("invoice"));
    }

    function _createBatch(address tokenAddress) private returns (uint256[] memory invoiceIds) {
        vm.prank(issuer);
        chainvoice.createInvoice(payer, 1 ether, tokenAddress, keccak256("invoice-1"));
        vm.prank(secondIssuer);
        chainvoice.createInvoice(payer, 2 ether, tokenAddress, keccak256("invoice-2"));

        invoiceIds = new uint256[](2);
        invoiceIds[0] = 0;
        invoiceIds[1] = 1;
    }

    function _approve(TransferBehaviorERC20 token, uint256 amount) private {
        vm.prank(payer);
        assertTrue(token.approve(address(chainvoice), amount));
    }

    function _callPayInvoice() private returns (bool success, bytes memory returnData) {
        uint256 fee = chainvoice.fee();
        vm.prank(payer);
        (success, returnData) =
            address(chainvoice).call{value: fee}(abi.encodeWithSelector(Chainvoice.payInvoice.selector, 0));
    }

    function _payInvoice() private {
        uint256 fee = chainvoice.fee();
        vm.prank(payer);
        chainvoice.payInvoice{value: fee}(0);
    }

    function _payInvoicesBatch(uint256[] memory invoiceIds) private {
        uint256 totalFee = chainvoice.fee() * invoiceIds.length;
        vm.prank(payer);
        chainvoice.payInvoicesBatch{value: totalFee}(invoiceIds);
    }

    function _expectPayInvoiceRevert(bytes memory revertData) private {
        uint256 fee = chainvoice.fee();
        vm.prank(payer);
        vm.expectRevert(revertData);
        chainvoice.payInvoice{value: fee}(0);
    }

    function _expectPayInvoicesBatchRevert(uint256[] memory invoiceIds, bytes memory revertData) private {
        uint256 totalFee = chainvoice.fee() * invoiceIds.length;
        vm.prank(payer);
        vm.expectRevert(revertData);
        chainvoice.payInvoicesBatch{value: totalFee}(invoiceIds);
    }

    function _assertUnpaid(TransferBehaviorERC20 token, uint256 payerBalance) private view {
        assertFalse(chainvoice.getInvoice(0).isPaid);
        assertEq(chainvoice.accumulatedFees(), 0);
        assertEq(token.balanceOf(issuer), 0);
        assertEq(token.balanceOf(payer), payerBalance);
    }
}
