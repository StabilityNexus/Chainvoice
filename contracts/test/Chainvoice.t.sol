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
        address receiver = 0x24F13d40CF7DE6a81a2a1949aA45F2242e81f1e2;
        uint256 amount = 100;
        c.createInvoice(amount, receiver);

        Chainvoice.InvoiceDetails[] memory sentInvoices = c.getMySentInvoices();
        assertEq(sentInvoices.length, 1); 
        assertEq(sentInvoices[0].to, receiver); 
        assertEq(sentInvoices[0].amountDue, amount); 
        assertTrue(sentInvoices[0].isPaid==false); 
        console.log("Sent Invoices Length: ", c.getMySentInvoices().length);
        console.log("Sender Address: ", address(this));
        console.log("Receiver Address: ", receiver);
        console.log("Invoice Amount Due: ", amount);
        console.log("-------------------------------------------");

        Chainvoice.InvoiceDetails[] memory receivedInvoices=c.getMyReceivedInvoices(0x24F13d40CF7DE6a81a2a1949aA45F2242e81f1e2);
        assertEq(receivedInvoices.length, 1);
        assertEq(receivedInvoices[0].to,0x24F13d40CF7DE6a81a2a1949aA45F2242e81f1e2);
        assertEq(receivedInvoices[0].from,address(this));
        assertEq(receivedInvoices[0].amountDue, amount);
        assertTrue(receivedInvoices[0].isPaid==false);
    }
    function testPayInvoice() public{
        address receiver = 0x24F13d40CF7DE6a81a2a1949aA45F2242e81f1e2;
        uint256 amount = 100;
        c.createInvoice(amount, receiver);
        vm.deal(receiver, 1000);
        console.log("Receiver Balance: ", address(receiver).balance);
        vm.prank(receiver);
        c.payInvoice{value:amount}(0);
        Chainvoice.InvoiceDetails[] memory sentInvoices = c.getMySentInvoices();
        assertEq(sentInvoices.length, 1); 
        assertEq(sentInvoices[0].to, receiver); 
        assertEq(sentInvoices[0].amountDue, amount); 
        assertTrue(sentInvoices[0].isPaid==true); 
        console.log("Sent Invoices Length: ", c.getMySentInvoices().length);
        console.log("Sender Address: ", address(this));
        console.log("Receiver Address: ", receiver);
        console.log("Invoice Amount Due: ", amount);
        console.log("Paid",sentInvoices[0].isPaid);
        console.log("-------------------------------------------");
    }
}



