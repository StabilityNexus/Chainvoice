// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

/**
 * @title Chainvoice
 * @author 
 * @notice A contract that allows users to create and pay invoices seamlessly.
 */
import {Test} from "../lib/forge-std/src/Test.sol";
import {console} from "../lib/forge-std/src/console.sol";
contract Chainvoice {
    struct InvoiceDetails {
        uint256 id;         // Unique ID for the invoice
        address from;       // Sender's address (invoice creator)
        address to;         // Receiver's address
        uint256 amountDue;  // Amount requested
        bool isPaid;        // Payment status
    }

    // Array to store all invoices
    InvoiceDetails[] public invoices;

    // Mappings to track invoice IDs for each user
    mapping(address => uint256[]) public sentInvoices;    // Invoices created by a user
    mapping(address => uint256[]) public receivedInvoices; // Invoices received by a user

    event InvoiceCreated(uint256 id, address indexed from, address indexed to, uint256 amountDue);
    event InvoicePaid(uint256 id, address indexed from, address indexed to, uint256 amountPaid);

    /**
     * @dev Create a new invoice request
     * @param amountDue The amount requested in the invoice
     * @param to The address of the receiver
     */
    function createInvoice(uint256 amountDue, address to) external {
        console.log(to);
        require(amountDue > 0, "Amount must be greater than zero");
        require(to != address(0), "Receiver address cannot be zero");
        require(to != msg.sender, "Cannot create invoice for yourself");

        // Create the invoice and push to the invoices array
        uint256 invoiceId = invoices.length;
        invoices.push(InvoiceDetails({
            id: invoiceId,
            from: msg.sender,
            to: to,
            amountDue: amountDue,
            isPaid: false
        }));

        // Track the invoice IDs for both sender and receiver
        sentInvoices[msg.sender].push(invoiceId);
        receivedInvoices[to].push(invoiceId);

        emit InvoiceCreated(invoiceId, msg.sender, to, amountDue);
    }
    /**
     * @dev Pay an invoice request using Ether
     * @param invoiceId The ID of the invoice to be paid
     */
    function payInvoice(uint256 invoiceId) external payable {
        require(invoiceId < invoices.length, "Invalid invoice ID");
        InvoiceDetails storage invoice = invoices[invoiceId];
        require(msg.sender == invoice.to, "Not authorized to pay this invoice");
        require(!invoice.isPaid, "Invoice already paid");
        require(msg.value == invoice.amountDue, "Incorrect payment amount");

        // Transfer Ether to the sender
        (bool success,) = payable(invoice.from).call{value: msg.value}("");
        require(success, "Payment transfer failed");
        invoice.isPaid = true;
        emit InvoicePaid(invoiceId, invoice.from, msg.sender, msg.value);
    }
    /**
     * @dev Get all invoices sent by the caller
     * @return An array of InvoiceDetails for invoices sent by the caller
     */
    function getMySentInvoices() external view returns (InvoiceDetails[] memory) {
        return _getInvoices(sentInvoices[msg.sender]);
    }

    /**
     * @dev Get all invoices received by the caller
     * @return An array of InvoiceDetails for invoices received by the caller
     */
    function getMyReceivedInvoices(address add) external view returns (InvoiceDetails[] memory) {
        return _getInvoices(receivedInvoices[add]);
    }

    /**
     * @dev Internal function to fetch invoices by IDs
     * @param invoiceIds Array of invoice IDs to fetch
     * @return An array of InvoiceDetails
     */
    function _getInvoices(uint256[] storage invoiceIds) internal view returns (InvoiceDetails[] memory) {
        InvoiceDetails[] memory userInvoices = new InvoiceDetails[](invoiceIds.length);

        for (uint256 i = 0; i < invoiceIds.length; i++) {
            userInvoices[i] = invoices[invoiceIds[i]];
        }

        return userInvoices;
    }
}
