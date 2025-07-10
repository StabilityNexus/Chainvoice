// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}

contract Chainvoice {
    struct InvoiceDetails {
        uint256 id;
        address from;
        address to;
        uint256 amountDue;
        address tokenAddress;
        bool isPaid;
        string encryptedInvoiceData; //  Base64-encoded ciphertext
        string encryptedHash;
    }

    InvoiceDetails[] public invoices;

    mapping(address => uint256[]) public sentInvoices;
    mapping(address => uint256[]) public receivedInvoices;

    address public owner;
    address public treasuryAddress;
    uint256 public fee;
    uint256 public accumulatedFees;

    event InvoiceCreated(
        uint256 indexed id,
        address indexed from,
        address indexed to,
        address tokenAddress
    );

    event InvoicePaid(
        uint256 indexed id,
        address indexed from,
        address indexed to,
        uint256 amount,
        address tokenAddress
    );

    constructor() {
        owner = msg.sender;
        fee = 0.0005 ether;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    function createInvoice(
        address to,
        uint256 amountDue,
        address tokenAddress,
        string memory encryptedInvoiceData,
        string memory encryptedHash
    ) external {
        require(to != address(0), "Recipient address is zero");
        require(to != msg.sender, "Self-invoicing not allowed");

        if (tokenAddress != address(0)) { 
            require(tokenAddress.code.length > 0, "Not a contract address");
            (bool success,) = tokenAddress.staticcall(
                abi.encodeWithSignature("balanceOf(address)", address(this))
            );
            require(success, "Not an ERC20 token");
        }
        uint256 invoiceId = invoices.length;

        invoices.push(
            InvoiceDetails({
                id: invoiceId,
                from: msg.sender,
                to: to,
                amountDue: amountDue,
                tokenAddress: tokenAddress,
                isPaid: false,
                encryptedInvoiceData: encryptedInvoiceData,
                encryptedHash: encryptedHash
            })
        );

        sentInvoices[msg.sender].push(invoiceId);
        receivedInvoices[to].push(invoiceId);

        emit InvoiceCreated(invoiceId, msg.sender, to, tokenAddress);
    }

    function payInvoice(uint256 invoiceId) external payable {
        require(invoiceId < invoices.length, "Invalid invoice ID");

        InvoiceDetails storage invoice = invoices[invoiceId];
        require(msg.sender == invoice.to, "Not authorized");
        require(!invoice.isPaid, "Already paid");

        if (invoice.tokenAddress == address(0)) {
            // Native token (ETH) payment
            require(msg.value == invoice.amountDue + fee,"Incorrect payment amount");
            accumulatedFees += fee;

            uint256 amountToSender = msg.value - fee;
            (bool sent, ) = payable(invoice.from).call{value: amountToSender}("");
            require(sent, "Transfer failed");
        } else {
            // ERC20 token payment
            require(msg.value == fee, "Must pay fee in native token");
            require(IERC20(invoice.tokenAddress).allowance(msg.sender,address(this)) >= invoice.amountDue,"Insufficient allowance");

            accumulatedFees += fee;
            bool transferSuccess = IERC20(invoice.tokenAddress).transferFrom(
                msg.sender,
                invoice.from,
                invoice.amountDue
            );
            require(transferSuccess, "Token transfer failed");
        }

        invoice.isPaid = true;
        emit InvoicePaid(
            invoiceId,
            invoice.from,
            invoice.to,
            invoice.amountDue,
            invoice.tokenAddress
        );
    }

    function getPaymentStatus(uint256 invoiceId, address payer) external view returns (
        bool canPay,
        uint256 payerBalance,
        uint256 allowanceAmount
    ) {
        require(invoiceId < invoices.length, "Invalid invoice ID");
        InvoiceDetails memory invoice = invoices[invoiceId];
        
        if (invoice.tokenAddress == address(0)) {
            return (
                payer.balance >= invoice.amountDue + fee,
                payer.balance,
                type(uint256).max // Native token has no allowance
            );
        } else {
            return (
                IERC20(invoice.tokenAddress).balanceOf(payer) >= invoice.amountDue &&
                IERC20(invoice.tokenAddress).allowance(payer, address(this)) >= invoice.amountDue,
                IERC20(invoice.tokenAddress).balanceOf(payer),
                IERC20(invoice.tokenAddress).allowance(payer, address(this))
            );
        }
    }

    function getSentInvoices(
        address user
    ) external view returns (InvoiceDetails[] memory) {
        return _getInvoices(sentInvoices[user]);
    }

    function getReceivedInvoices(
        address user
    ) external view returns (InvoiceDetails[] memory) {
        return _getInvoices(receivedInvoices[user]);
    }

    function _getInvoices(
        uint256[] storage ids
    ) internal view returns (InvoiceDetails[] memory) {
        InvoiceDetails[] memory result = new InvoiceDetails[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = invoices[ids[i]];
        }
        return result;
    }

    function getInvoice(
        uint256 invoiceId
    ) external view returns (InvoiceDetails memory) {
        require(invoiceId < invoices.length, "Invalid ID");
        return invoices[invoiceId];
    }

    function setFeeAmount(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function setTreasuryAddress(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Zero address");
        treasuryAddress = newTreasury;
    }

    function withdrawFees() external {
        require(treasuryAddress != address(0), "Treasury not set");
        require(accumulatedFees > 0, "No fees available");

        uint256 amount = accumulatedFees;
        accumulatedFees = 0;

        (bool success, ) = payable(treasuryAddress).call{value: amount}("");
        require(success, "Withdraw failed");
    }
}
