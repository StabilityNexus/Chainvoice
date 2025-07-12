export const ChainvoiceABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "accumulatedFees",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createInvoice",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amountDue",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "encryptedInvoiceData",
        type: "string",
        internalType: "string",
      },
      {
        name: "encryptedHash",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fee",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getInvoice",
    inputs: [
      {
        name: "invoiceId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Chainvoice.InvoiceDetails",
        components: [
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "from",
            type: "address",
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "amountDue",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "isPaid",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "encryptedInvoiceData",
            type: "string",
            internalType: "string",
          },
          {
            name: "encryptedHash",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPaymentStatus",
    inputs: [
      {
        name: "invoiceId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "payer",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "canPay",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "payerBalance",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "allowanceAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReceivedInvoices",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct Chainvoice.InvoiceDetails[]",
        components: [
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "from",
            type: "address",
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "amountDue",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "isPaid",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "encryptedInvoiceData",
            type: "string",
            internalType: "string",
          },
          {
            name: "encryptedHash",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSentInvoices",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct Chainvoice.InvoiceDetails[]",
        components: [
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "from",
            type: "address",
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "amountDue",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "isPaid",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "encryptedInvoiceData",
            type: "string",
            internalType: "string",
          },
          {
            name: "encryptedHash",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "invoices",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amountDue",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "isPaid",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "encryptedInvoiceData",
        type: "string",
        internalType: "string",
      },
      {
        name: "encryptedHash",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "payInvoice",
    inputs: [
      {
        name: "invoiceId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "receivedInvoices",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "sentInvoices",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setFeeAmount",
    inputs: [
      {
        name: "_fee",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTreasuryAddress",
    inputs: [
      {
        name: "newTreasury",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "treasuryAddress",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdrawFees",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "InvoiceCreated",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "InvoicePaid",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "tokenAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
];