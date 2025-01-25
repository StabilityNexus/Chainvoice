export const ChainvoiceABI = [
	{
	  "type": "function",
	  "name": "createInvoice",
	  "inputs": [
		{
		  "name": "amountDue",
		  "type": "uint256",
		},
		{
		  "name": "to",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "getMyReceivedInvoices",
	  "inputs": [
		{
		  "name": "add",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "tuple[]",
		  "internalType": "struct Chainvoice.InvoiceDetails[]",
		  "components": [
			{
			  "name": "id",
			  "type": "uint256",
			  "internalType": "uint256"
			},
			{
			  "name": "from",
			  "type": "address",
			  "internalType": "address"
			},
			{
			  "name": "to",
			  "type": "address",
			  "internalType": "address"
			},
			{
			  "name": "amountDue",
			  "type": "uint256",
			  "internalType": "uint256"
			},
			{
			  "name": "isPaid",
			  "type": "bool",
			  "internalType": "bool"
			}
		  ]
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getMySentInvoices",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "tuple[]",
		  "internalType": "struct Chainvoice.InvoiceDetails[]",
		  "components": [
			{
			  "name": "id",
			  "type": "uint256",
			  "internalType": "uint256"
			},
			{
			  "name": "from",
			  "type": "address",
			  "internalType": "address"
			},
			{
			  "name": "to",
			  "type": "address",
			  "internalType": "address"
			},
			{
			  "name": "amountDue",
			  "type": "uint256",
			  "internalType": "uint256"
			},
			{
			  "name": "isPaid",
			  "type": "bool",
			  "internalType": "bool"
			}
		  ]
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "invoices",
	  "inputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "id",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "from",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "to",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "amountDue",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "isPaid",
		  "type": "bool",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "payInvoice",
	  "inputs": [
		{
		  "name": "invoiceId",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "payable"
	},
	{
	  "type": "function",
	  "name": "receivedInvoices",
	  "inputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "sentInvoices",
	  "inputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "event",
	  "name": "InvoiceCreated",
	  "inputs": [
		{
		  "name": "id",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "from",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "to",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amountDue",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "InvoicePaid",
	  "inputs": [
		{
		  "name": "id",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "from",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "to",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amountPaid",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	}
  ]