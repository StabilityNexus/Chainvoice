// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Test} from "../lib/forge-std/src/Test.sol";
import {console} from "../lib/forge-std/src/console.sol";
import "../src/Chainvoice.sol";

contract TestChainvoice is Test {
    Chainvoice c;
    receive() external payable {}
    function setUp() public {
        c = new Chainvoice();
    }

    function testCreateInvoice() public {
        address receiverAdd = 0x24F13d40CF7DE6a81a2a1949aA45F2242e81f1e2;
        uint256 amount = 100;
        string memory dueDate = "4/1/2025, 8:45:47 PM";
        string memory issueDate = "4/19/2025, 8:45:47 PM";
        Chainvoice.UserDetails memory sender = Chainvoice.UserDetails({
            fname: "Alice",
            lname: "Doe",
            email: "alice@example.com",
            country: "UK",
            city: "London",
            postalcode: "SW1A 1AA"
        });
        Chainvoice.UserDetails memory receiver = Chainvoice.UserDetails({
            fname: "Bob",
            lname: "Smith",
            email: "bob@example.com",
            country: "UK",
            city: "Manchester",
            postalcode: "M1 1AA"
        });

        Chainvoice.ItemData[] memory items = new Chainvoice.ItemData[](1);
        items[0] = Chainvoice.ItemData({
            description: "Laptop",
            qty: 1,
            unitPrice: 1000,
            discount: 100,
            tax: 50,
            amount: 950
        });

        c.createInvoice(
            amount,
            receiverAdd,
            dueDate,
            issueDate,
            sender,
            receiver,
            items
        );

        (
            Chainvoice.InvoiceDetails[] memory sentInvoices,
            Chainvoice.ItemData[][] memory itemsData
        ) = c.getSentInvoices(address(this));
        assertEq(sentInvoices.length, 1);
        assertEq(sentInvoices[0].to, receiverAdd);
        // assertEq(sentInvoices[0].amountDue, amount);
        assertTrue(sentInvoices[0].isPaid == false);
        assertTrue(itemsData.length == 1);
        assertTrue(itemsData[0].length == 1);
        assertTrue(itemsData[0][0].amount == 950);
        // console.log("Sent Invoices Length: ", c.getSentInvoices().length);
        console.log("Sender Address: ", address(this));
        console.log("Receiver Address: ", receiverAdd);
        console.log("Invoice Amount Due: ", amount);
        console.log("-------------------------------------------");

        (
            Chainvoice.InvoiceDetails[] memory receivedInvoices,
            // Chainvoice.ItemData[][] memory itemsDetail
        ) = c.getReceivedInvoices(0x24F13d40CF7DE6a81a2a1949aA45F2242e81f1e2);
        assertEq(receivedInvoices.length, 1);
        assertEq(
            receivedInvoices[0].to,
            0x24F13d40CF7DE6a81a2a1949aA45F2242e81f1e2
        );
        assertEq(receivedInvoices[0].from, address(this));
        assertEq(receivedInvoices[0].amountDue, amount);
        assertTrue(receivedInvoices[0].isPaid == false);
    }

    function testPayInvoice() public {
        // Set up invoice details
        address receiverAdd = 0x24F13d40CF7DE6a81a2a1949aA45F2242e81f1e2;
        uint256 amount = 100;
        uint256 fee = 500000000000000; //0.0005 ether
        string memory dueDate = "4/1/2025, 8:45:47 PM";
        string memory issueDate = "4/19/2025, 8:45:47 PM";
        Chainvoice.UserDetails memory sender = Chainvoice.UserDetails({
            fname: "Alice",
            lname: "Doe",
            email: "alice@example.com",
            country: "UK",
            city: "London",
            postalcode: "SW1A 1AA"
        });

        Chainvoice.UserDetails memory receiver = Chainvoice.UserDetails({
            fname: "Bob",
            lname: "Smith",
            email: "bob@example.com",
            country: "UK",
            city: "Manchester",
            postalcode: "M1 1AA"
        });

        Chainvoice.ItemData[] memory Items = new Chainvoice.ItemData[](1);
        Items[0] = Chainvoice.ItemData({
            description: "Laptop",
            qty: 1,
            unitPrice: 1000,
            discount: 100,
            tax: 50,
            amount: 950
        });
        c.createInvoice(
            amount,
            receiverAdd,
            issueDate,
            dueDate,
            sender,
            receiver,
            Items
        );

        vm.deal(receiverAdd, 500000000000100);

        console.log("Fee in native currency : ", fee);
        uint256 initialBalance = receiverAdd.balance;
        console.log("Initial Receiver Balance: ", initialBalance);
        vm.prank(receiverAdd);
        c.payInvoice{value: amount + fee}(0);

        (Chainvoice.InvoiceDetails[] memory sentInvoices, ) = // Chainvoice.ItemData[][] memory itemsDetail
        c.getSentInvoices(address(this));
        assertEq(sentInvoices.length, 1);
        assertEq(sentInvoices[0].to, receiverAdd);
        assertEq(sentInvoices[0].amountDue, amount);
        assertTrue(sentInvoices[0].isPaid == true);

        assertEq(c.accumulatedFees(), fee);
        uint256 finalBalance = receiverAdd.balance;
        console.log("Final Receiver Balance: ", finalBalance);
        assertEq(finalBalance, initialBalance - (amount + fee));

        // console.log("Sent Invoices Length: ", c.getSentInvoices().length);
        console.log("Sender Address: ", address(this));
        console.log("Receiver Address: ", receiverAdd);
        console.log("Invoice Amount Due: ", amount);
        console.log("Paid", sentInvoices[0].isPaid);
        console.log("Accumulated Fees: ", c.accumulatedFees());
        console.log("-------------------------------------------");
    }
}
