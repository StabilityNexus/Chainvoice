// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;
import {Test} from "../lib/forge-std/src/Test.sol";
import {console} from "../lib/forge-std/src/console.sol";

contract Chainvoice {
    struct UserDetails {
        string fname;
        string lname;
        string email;
        string country;
        string city;
        string postalcode;
    }
    struct ItemData {
        string description;
        int256 qty;
        int256 unitPrice;
        int256 discount;
        int256 tax;
        int256 amount;
    }
    struct InvoiceDetails {
        uint256 id;
        address from;
        string dueDate;
        string issueDate;
        UserDetails user; // Struct to store user details
        address to;
        UserDetails client; // Struct to store client details
        uint256 amountDue;
        bool isPaid;
    }

    InvoiceDetails[] public invoices;
    mapping(address => uint256[]) public sentInvoices;
    mapping(address => uint256[]) public receivedInvoices;
    mapping(uint256 => ItemData[]) public itemDatas;

    address public owner;
    address public treasuryAddress;
    uint256 public fee;

    constructor() {
        owner = msg.sender;
        fee = 500000000000000 ; //0.0005 ether
    }

    modifier OnlyOwner() {
        require(msg.sender == owner, "Only Owner is accessible");
        _;
    }
    event InvoiceCreated(
        uint256 id,
        address indexed from,
        address indexed to,
        uint256 amountDue
    );
    event InvoicePaid(
        uint256 id,
        address indexed from,
        address indexed to,
        uint256 amountPaid
    );

    function createInvoice(
        uint256 amountDue,
        address to,
        string memory _dueDate,
        string memory _issueDate,
        UserDetails memory user,
        UserDetails memory client,
        ItemData[] memory _items
    ) external {
        require(amountDue > 0, "Amount must be greater than zero");
        require(to != address(0), "Receiver address cannot be zero");
        require(to != msg.sender, "Cannot create invoice for yourself");

        uint256 invoiceId = invoices.length;
        invoices.push(
            InvoiceDetails({
                id: invoiceId,
                from: msg.sender,
                dueDate:_dueDate,
                issueDate: _issueDate,
                user: user,
                to: to,
                client: client,
                amountDue: amountDue,
                isPaid: false
            })
        );

        for (uint256 i = 0; i < _items.length; i++) {
            itemDatas[invoiceId].push(_items[i]);
        }

        sentInvoices[msg.sender].push(invoiceId);
        receivedInvoices[to].push(invoiceId);

        emit InvoiceCreated(invoiceId, msg.sender, to, amountDue);
    }

    uint256 public accumulatedFees;

    function payInvoice(uint256 invoiceId) external payable {
        require(invoiceId < invoices.length, "Invalid invoice ID");
        InvoiceDetails storage invoice = invoices[invoiceId];
        require(msg.sender == invoice.to, "Not authorized to pay this invoice");
        require(!invoice.isPaid, "Invoice already paid");
        require(
            msg.value >= invoice.amountDue + fee,
            "Payment must cover the invoice amount and fee"
        );
        uint256 amountToRecipient = msg.value - fee;
        (bool success, ) = payable(invoice.from).call{value: amountToRecipient}(
            ""
        );
        require(success, "Payment transfer failed");
        accumulatedFees += fee;
        invoice.isPaid = true;
    }

    function getSentInvoices(address _address)
        external
        view
        returns (InvoiceDetails[] memory, ItemData[][] memory)
    {
        return _getInvoices(sentInvoices[_address]);
    }

    function getReceivedInvoices(
        address _address
    ) external view returns (InvoiceDetails[] memory, ItemData[][] memory) {
        return _getInvoices(receivedInvoices[_address]);
    }

    function _getInvoices(
        uint256[] storage invoiceIds
    ) internal view returns (InvoiceDetails[] memory, ItemData[][] memory) {
        InvoiceDetails[] memory userInvoices = new InvoiceDetails[](
            invoiceIds.length
        );
        ItemData[][] memory items = new ItemData[][](invoiceIds.length);

        for (uint256 i = 0; i < invoiceIds.length; i++) {
            userInvoices[i] = invoices[invoiceIds[i]];
            items[i] = itemDatas[invoiceIds[i]];
        }

        return (userInvoices, items);
    }

    function setTreasuryAddress(address newTreauserAdd) public OnlyOwner {
        require(newTreauserAdd != address(0), "Treasury Address cannot be equal to zero");
        treasuryAddress = newTreauserAdd;
    }

   
    function setFeeAmount(uint256 _fee) public OnlyOwner {
        fee = _fee;
    }

    function withdraw() external {
        require(treasuryAddress != address(0), "Treasury address not set");
        require(accumulatedFees > 0, "No fees to withdraw");
        
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;

        (bool success, ) = payable(treasuryAddress).call{value: amount}("");
        require(success, "Fee withdrawal failed");
    }
}
