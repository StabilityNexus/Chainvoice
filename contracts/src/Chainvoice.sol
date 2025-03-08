// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;
import {Test} from "../lib/forge-std/src/Test.sol";
import {console} from "../lib/forge-std/src/console.sol";
import {AggregatorV3Interface} from "../lib/chainlink-brownie-contracts/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Chainvoice {
    AggregatorV3Interface internal priceFeed;
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
    uint256 public feeAmountInUSD;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        owner = msg.sender;
        feeAmountInUSD = 1 * 1e18;
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

    function usdToNativeCurrencyConversion() public view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        require(answer > 0, "Invalid price data");
        uint256 price = uint256(answer);
        uint256 ethPriceAdjusted = price * 1e10;
        uint256 nativeAmount = (feeAmountInUSD * 1e18);

        return nativeAmount / ethPriceAdjusted;
    }

    uint256 public accumulatedFees;

    function payInvoice(uint256 invoiceId) external payable {
        require(invoiceId < invoices.length, "Invalid invoice ID");
        InvoiceDetails storage invoice = invoices[invoiceId];
        require(msg.sender == invoice.to, "Not authorized to pay this invoice");
        require(!invoice.isPaid, "Invoice already paid");

        uint256 feeAmountInNativeCurrency = usdToNativeCurrencyConversion();
        require(
            msg.value >= invoice.amountDue + feeAmountInNativeCurrency,
            "Payment must cover the invoice amount and fee"
        );
        uint256 amountToRecipient = msg.value - feeAmountInNativeCurrency;
        (bool success, ) = payable(invoice.from).call{value: amountToRecipient}(
            ""
        );
        require(success, "Payment transfer failed");
        accumulatedFees += feeAmountInNativeCurrency;
        invoice.isPaid = true;
    }

    function getMySentInvoices()
        external
        view
        returns (InvoiceDetails[] memory, ItemData[][] memory)
    {
        return _getInvoices(sentInvoices[msg.sender]);
    }

    function getMyReceivedInvoices(
        address add
    ) external view returns (InvoiceDetails[] memory, ItemData[][] memory) {
        return _getInvoices(receivedInvoices[add]);
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

    function setTreasuryAddress(address add) public OnlyOwner {
        require(add != address(0), "Treasury Address cannot be equal to zero");
        treasuryAddress = add;
    }

    function getTreasuryAddress() public view returns (address) {
        return treasuryAddress;
    }

    function setFeeAmount(uint16 fee) public OnlyOwner {
        feeAmountInUSD = fee * 1e18;
    }

    function withdraw() external {
        require(accumulatedFees > 0, "No fees to withdraw");
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;

        (bool success, ) = payable(treasuryAddress).call{value: amount}("");
        require(success, "Fee withdrawal failed");
    }
}
