// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract Chainvoice {
    struct InvoiceDetails {
        uint256 id;
        address from;
        address to;
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
        address indexed to
    );

    event InvoicePaid(
        uint256 indexed id,
        address indexed from,
        address indexed to,
        uint256 amount
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
        string memory encryptedInvoiceData,
        string memory encryptedHash
    ) external {
        require(to != address(0), "Recipient address is zero");
        require(to != msg.sender, "Self-invoicing not allowed");

        uint256 invoiceId = invoices.length;

        invoices.push(
            InvoiceDetails({
                id: invoiceId,
                from: msg.sender,
                to: to,
                isPaid: false,
                encryptedInvoiceData: encryptedInvoiceData,
                encryptedHash:encryptedHash
            })
        );

        sentInvoices[msg.sender].push(invoiceId);
        receivedInvoices[to].push(invoiceId);

        emit InvoiceCreated(invoiceId, msg.sender, to);
    }

    function payInvoice(uint256 invoiceId) external payable {
        require(invoiceId < invoices.length, "Invalid invoice ID");

        InvoiceDetails storage invoice = invoices[invoiceId];
        require(msg.sender == invoice.to, "Not authorized");
        require(!invoice.isPaid, "Already paid");
        require(msg.value > fee, "Insufficient payment for invoice + fee");

        uint256 amountToSender = msg.value - fee;
        accumulatedFees += fee;

        (bool sent, ) = payable(invoice.from).call{value: amountToSender}("");
        require(sent, "Transfer failed");

        invoice.isPaid = true;

        emit InvoicePaid(invoiceId, invoice.from, invoice.to, msg.value);
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
