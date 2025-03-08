export const ChainvoiceABI = [
	{
	  "type": "constructor",
	  "inputs": [
		{
		  "name": "_priceFeed",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "accumulatedFees",
	  "inputs": [],
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
	  "name": "createInvoice",
	  "inputs": [
		{
		  "name": "amountDue",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "to",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "_dueDate",
		  "type": "string",
		  "internalType": "string"
		},
		{
		  "name": "_issueDate",
		  "type": "string",
		  "internalType": "string"
		},
		{
		  "name": "user",
		  "type": "tuple",
		  "internalType": "struct Chainvoice.UserDetails",
		  "components": [
			{
			  "name": "fname",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "lname",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "email",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "country",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "city",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "postalcode",
			  "type": "string",
			  "internalType": "string"
			}
		  ]
		},
		{
		  "name": "client",
		  "type": "tuple",
		  "internalType": "struct Chainvoice.UserDetails",
		  "components": [
			{
			  "name": "fname",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "lname",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "email",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "country",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "city",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "postalcode",
			  "type": "string",
			  "internalType": "string"
			}
		  ]
		},
		{
		  "name": "_items",
		  "type": "tuple[]",
		  "internalType": "struct Chainvoice.ItemData[]",
		  "components": [
			{
			  "name": "description",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "qty",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "unitPrice",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "discount",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "tax",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "amount",
			  "type": "int256",
			  "internalType": "int256"
			}
		  ]
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "feeAmountInUSD",
	  "inputs": [],
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
			  "name": "dueDate",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "issueDate",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "user",
			  "type": "tuple",
			  "internalType": "struct Chainvoice.UserDetails",
			  "components": [
				{
				  "name": "fname",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "lname",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "email",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "country",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "city",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "postalcode",
				  "type": "string",
				  "internalType": "string"
				}
			  ]
			},
			{
			  "name": "to",
			  "type": "address",
			  "internalType": "address"
			},
			{
			  "name": "client",
			  "type": "tuple",
			  "internalType": "struct Chainvoice.UserDetails",
			  "components": [
				{
				  "name": "fname",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "lname",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "email",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "country",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "city",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "postalcode",
				  "type": "string",
				  "internalType": "string"
				}
			  ]
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
		},
		{
		  "name": "",
		  "type": "tuple[][]",
		  "internalType": "struct Chainvoice.ItemData[][]",
		  "components": [
			{
			  "name": "description",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "qty",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "unitPrice",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "discount",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "tax",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "amount",
			  "type": "int256",
			  "internalType": "int256"
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
			  "name": "dueDate",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "issueDate",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "user",
			  "type": "tuple",
			  "internalType": "struct Chainvoice.UserDetails",
			  "components": [
				{
				  "name": "fname",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "lname",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "email",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "country",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "city",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "postalcode",
				  "type": "string",
				  "internalType": "string"
				}
			  ]
			},
			{
			  "name": "to",
			  "type": "address",
			  "internalType": "address"
			},
			{
			  "name": "client",
			  "type": "tuple",
			  "internalType": "struct Chainvoice.UserDetails",
			  "components": [
				{
				  "name": "fname",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "lname",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "email",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "country",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "city",
				  "type": "string",
				  "internalType": "string"
				},
				{
				  "name": "postalcode",
				  "type": "string",
				  "internalType": "string"
				}
			  ]
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
		},
		{
		  "name": "",
		  "type": "tuple[][]",
		  "internalType": "struct Chainvoice.ItemData[][]",
		  "components": [
			{
			  "name": "description",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "qty",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "unitPrice",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "discount",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "tax",
			  "type": "int256",
			  "internalType": "int256"
			},
			{
			  "name": "amount",
			  "type": "int256",
			  "internalType": "int256"
			}
		  ]
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getTreasuryAddress",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
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
		  "name": "dueDate",
		  "type": "string",
		  "internalType": "string"
		},
		{
		  "name": "issueDate",
		  "type": "string",
		  "internalType": "string"
		},
		{
		  "name": "user",
		  "type": "tuple",
		  "internalType": "struct Chainvoice.UserDetails",
		  "components": [
			{
			  "name": "fname",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "lname",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "email",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "country",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "city",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "postalcode",
			  "type": "string",
			  "internalType": "string"
			}
		  ]
		},
		{
		  "name": "to",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "client",
		  "type": "tuple",
		  "internalType": "struct Chainvoice.UserDetails",
		  "components": [
			{
			  "name": "fname",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "lname",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "email",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "country",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "city",
			  "type": "string",
			  "internalType": "string"
			},
			{
			  "name": "postalcode",
			  "type": "string",
			  "internalType": "string"
			}
		  ]
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
	  "name": "itemDatas",
	  "inputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "description",
		  "type": "string",
		  "internalType": "string"
		},
		{
		  "name": "qty",
		  "type": "int256",
		  "internalType": "int256"
		},
		{
		  "name": "unitPrice",
		  "type": "int256",
		  "internalType": "int256"
		},
		{
		  "name": "discount",
		  "type": "int256",
		  "internalType": "int256"
		},
		{
		  "name": "tax",
		  "type": "int256",
		  "internalType": "int256"
		},
		{
		  "name": "amount",
		  "type": "int256",
		  "internalType": "int256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "owner",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
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
	  "type": "function",
	  "name": "setFeeAmount",
	  "inputs": [
		{
		  "name": "fee",
		  "type": "uint16",
		  "internalType": "uint16"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "setTreasuryAddress",
	  "inputs": [
		{
		  "name": "add",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "treasuryAddress",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "usdToNativeCurrencyConversion",
	  "inputs": [],
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
	  "name": "withdraw",
	  "inputs": [],
	  "outputs": [],
	  "stateMutability": "nonpayable"
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