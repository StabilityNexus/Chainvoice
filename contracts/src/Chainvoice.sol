// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract Chainvoice {
    // Errors
    error MixedTokenBatch();
    error InvalidBatchSize();
    error AlreadySettled();
    error NotAuthorizedPayer();
    error IncorrectNativeValue();
    error InsufficientAllowance();
    error InvalidNewOwner();
    error OwnershipNotPending();

    // Storage
    struct InvoiceDetails {
        uint256 id;
        address from;
        address to;
        uint256 amountDue;
        address tokenAddress;     // address(0) == native
        bool isPaid;
        bool isCancelled;
        string encryptedInvoiceData; // Base64-encoded ciphertext
        string encryptedHash;        // Content hash or integrity ref
    }

    InvoiceDetails[] public invoices;
    mapping(address => uint256[]) public sentInvoices;
    mapping(address => uint256[]) public receivedInvoices;

    address public owner;
    address public treasuryAddress;
    uint256 public fee;                // native fee per invoice
    uint256 public accumulatedFees;    // native fees accrued (for withdraw)
    address public pendingOwner;  // Two-step ownership transfer

    // Events
    event InvoiceCreated(uint256 indexed id, address indexed from, address indexed to, address tokenAddress);
    event InvoicePaid(uint256 indexed id, address indexed from, address indexed to, uint256 amount, address tokenAddress);
    event InvoiceCancelled(uint256 indexed id, address indexed from, address indexed to, address tokenAddress);

    event InvoiceBatchCreated(address indexed creator, address indexed token, uint256 count, uint256[] ids);
    event InvoiceBatchPaid(address indexed payer, address indexed token, uint256 count, uint256 totalAmount, uint256[] ids);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferInitiated(address indexed currentOwner, address indexed pendingOwner);
    event OwnershipTransferCancelled(address indexed owner, address indexed cancelledPendingOwner);
    event FeeUpdated(uint256 indexed previousFee, uint256 indexed newFee);
    event TreasuryAddressUpdated(address indexed previousTreasury, address indexed newTreasury);

    // Constructor
    constructor() {
        owner = msg.sender;
        fee = 0.0005 ether;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    // Simple non-reentrancy guard
    bool private _entered;
    modifier nonReentrant() {
        require(!_entered, "Reentrancy");
        _entered = true;
        _;
        _entered = false;
    }

    // Constants
    uint256 public constant MAX_BATCH = 50;

    // Internal utils
    function _isERC20(address token) internal view returns (bool) {
        if (token == address(0)) return false;
        if (token.code.length == 0) return false;
        (bool success, ) = token.staticcall(
            abi.encodeWithSignature("balanceOf(address)", address(this))
        );
        return success;
    }

    // ========== Single-invoice create ==========
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
            (bool success, ) = tokenAddress.staticcall(
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
                isCancelled: false,
                encryptedInvoiceData: encryptedInvoiceData,
                encryptedHash: encryptedHash
            })
        );

        sentInvoices[msg.sender].push(invoiceId);
        receivedInvoices[to].push(invoiceId);

        emit InvoiceCreated(invoiceId, msg.sender, to, tokenAddress);
    }

    // ========== Batch create ==========
    function createInvoicesBatch(
        address[] calldata tos,
        uint256[] calldata amountsDue,
        address tokenAddress,
        string[] calldata encryptedPayloads,
        string[] calldata encryptedHashes
    ) external {
        uint256 n = tos.length;
        if (n == 0 || n > MAX_BATCH) revert InvalidBatchSize();
        require(
            n == amountsDue.length &&
            n == encryptedPayloads.length &&
            n == encryptedHashes.length,
            "Array length mismatch"
        );

        if (tokenAddress != address(0)) {
            require(tokenAddress.code.length > 0, "Not a contract address");
            (bool ok, ) = tokenAddress.staticcall(
                abi.encodeWithSignature("balanceOf(address)", address(this))
            );
            require(ok, "Not an ERC20 token");
        }

        uint256[] memory ids = new uint256[](n);

        for (uint256 i = 0; i < n; i++) {
            address to = tos[i];
            require(to != address(0), "Recipient zero");
            require(to != msg.sender, "Self-invoicing");
            uint256 amt = amountsDue[i];
            require(amt > 0, "Amount zero");

            uint256 invoiceId = invoices.length;

            invoices.push(
                InvoiceDetails({
                    id: invoiceId,
                    from: msg.sender,
                    to: to,
                    amountDue: amt,
                    tokenAddress: tokenAddress,
                    isPaid: false,
                    isCancelled: false,
                    encryptedInvoiceData: encryptedPayloads[i],
                    encryptedHash: encryptedHashes[i]
                })
            );

            sentInvoices[msg.sender].push(invoiceId);
            receivedInvoices[to].push(invoiceId);

            emit InvoiceCreated(invoiceId, msg.sender, to, tokenAddress);
            ids[i] = invoiceId;
        }

        emit InvoiceBatchCreated(msg.sender, tokenAddress, n, ids);
    }

    // ========== Cancel single invoice ==========
    function cancelInvoice(uint256 invoiceId) external {
        require(invoiceId < invoices.length, "Invalid invoice ID");
        InvoiceDetails storage invoice = invoices[invoiceId];

        require(msg.sender == invoice.from, "Only invoice creator can cancel");
        require(!invoice.isPaid && !invoice.isCancelled, "Invoice not cancellable");

        invoice.isCancelled = true;

        emit InvoiceCancelled(
            invoiceId,
            invoice.from,
            invoice.to,
            invoice.tokenAddress
        );
    }

    // ========== Pay single invoice ==========
    function payInvoice(uint256 invoiceId) external payable nonReentrant {
        require(invoiceId < invoices.length, "Invalid invoice ID");

        InvoiceDetails storage invoice = invoices[invoiceId];
        require(msg.sender == invoice.to, "Not authorized");
        require(!invoice.isPaid, "Already paid");
        require(!invoice.isCancelled, "Invoice is cancelled");

        // Effects first for CEI (mark paid, bump fees), then interactions
        invoice.isPaid = true;

        if (invoice.tokenAddress == address(0)) {
            require(msg.value == invoice.amountDue + fee, "Incorrect payment amount");
            accumulatedFees += fee;

            (bool sent, ) = payable(invoice.from).call{value: invoice.amountDue}("");
            require(sent, "Transfer failed");
        } else {
            require(msg.value == fee, "Must pay fee in native token");
            require(
                IERC20(invoice.tokenAddress).allowance(msg.sender, address(this)) >= invoice.amountDue,
                "Insufficient allowance"
            );

            accumulatedFees += fee;

            bool transferSuccess = IERC20(invoice.tokenAddress).transferFrom(
                msg.sender,
                invoice.from,
                invoice.amountDue
            );
            require(transferSuccess, "Token transfer failed");
        }

        emit InvoicePaid(
            invoiceId,
            invoice.from,
            invoice.to,
            invoice.amountDue,
            invoice.tokenAddress
        );
    }

    // ========== Batch pay (all-or-nothing) ==========
    function payInvoicesBatch(uint256[] calldata invoiceIds) external payable nonReentrant {
        uint256 n = invoiceIds.length;
        if (n == 0 || n > MAX_BATCH) revert InvalidBatchSize();

        // Establish token for batch & initial checks
        uint256 firstId = invoiceIds[0];                // FIX: index into the array
        require(firstId < invoices.length, "Invalid id");

        InvoiceDetails storage inv0 = invoices[firstId];
        if (msg.sender != inv0.to) revert NotAuthorizedPayer();
        if (inv0.isPaid || inv0.isCancelled) revert AlreadySettled();

        address token = inv0.tokenAddress;

        uint256 totalAmounts = 0;
        uint256 totalNativeFee = fee * n;

        // Validate and sum
        for (uint256 i = 0; i < n; i++) {
            uint256 id = invoiceIds[i];
            require(id < invoices.length, "Invalid id");

            InvoiceDetails storage inv = invoices[id];

            if (msg.sender != inv.to) revert NotAuthorizedPayer();
            if (inv.isPaid || inv.isCancelled) revert AlreadySettled();
            if (inv.tokenAddress != token) revert MixedTokenBatch();

            totalAmounts += inv.amountDue;
        }

        // Effects: mark all paid & bump fee accumulator BEFORE interactions
        for (uint256 i = 0; i < n; i++) {
            invoices[invoiceIds[i]].isPaid = true;
        }
        accumulatedFees += totalNativeFee;

        // Interactions
        if (token == address(0)) {
            // Native: must include amounts + total fee
            if (msg.value != (totalAmounts + totalNativeFee)) revert IncorrectNativeValue();

            // Pay each issuer
            for (uint256 i = 0; i < n; i++) {
                InvoiceDetails storage inv = invoices[invoiceIds[i]];
                (bool sent, ) = payable(inv.from).call{value: inv.amountDue}("");
                require(sent, "Native transfer failed");
                emit InvoicePaid(inv.id, inv.from, inv.to, inv.amountDue, address(0));
            }
        } else {
            // ERC-20: fee in native, token from allowance
            if (msg.value != totalNativeFee) revert IncorrectNativeValue();

            IERC20 erc20 = IERC20(token);
            if (erc20.allowance(msg.sender, address(this)) < totalAmounts) {
                revert InsufficientAllowance();
            }

            for (uint256 i = 0; i < n; i++) {
                InvoiceDetails storage inv = invoices[invoiceIds[i]];
                bool ok = erc20.transferFrom(msg.sender, inv.from, inv.amountDue);
                require(ok, "Token transfer failed");
                emit InvoicePaid(inv.id, inv.from, inv.to, inv.amountDue, token);
            }
        }

        // Emit batch summary; dynamic array emitted from memory
        uint256[] memory idsCopy = new uint256[](n);
        for (uint256 i = 0; i < n; i++) idsCopy[i] = invoiceIds[i];

        emit InvoiceBatchPaid(msg.sender, token, n, totalAmounts, idsCopy);
    }

    // ========== Views ==========
    function getPaymentStatus(
        uint256 invoiceId,
        address payer
    )
        external
        view
        returns (bool canPay, uint256 payerBalance, uint256 allowanceAmount)
    {
        require(invoiceId < invoices.length, "Invalid invoice ID");
        InvoiceDetails memory invoice = invoices[invoiceId];

        if (invoice.isCancelled) {
            return (false, payer.balance, 0);
        }

        if (invoice.tokenAddress == address(0)) {
            // Native
            return (
                payer.balance >= invoice.amountDue + fee,
                payer.balance,
                type(uint256).max // Native has no allowance
            );
        } else {
            uint256 bal = IERC20(invoice.tokenAddress).balanceOf(payer);
            uint256 allw = IERC20(invoice.tokenAddress).allowance(payer, address(this));
            return (
                bal >= invoice.amountDue && allw >= invoice.amountDue,
                bal,
                allw
            );
        }
    }

    function getSentInvoices(address user) external view returns (InvoiceDetails[] memory) {
        return _getInvoices(sentInvoices[user]);
    }

    function getReceivedInvoices(address user) external view returns (InvoiceDetails[] memory) {
        return _getInvoices(receivedInvoices[user]);
    }

    function _getInvoices(uint256[] storage ids) internal view returns (InvoiceDetails[] memory) {
        InvoiceDetails[] memory result = new InvoiceDetails[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = invoices[ids[i]];
        }
        return result;
    }

    function getInvoice(uint256 invoiceId) external view returns (InvoiceDetails memory) {
        require(invoiceId < invoices.length, "Invalid ID");
        return invoices[invoiceId];
    }

    // ========== Admin - Ownership ==========
    /// @dev Initiates a two-step ownership transfer process
    /// @param newOwner Address of the new owner (must not be zero address)
    function initiateOwnershipTransfer(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidNewOwner();
        if (newOwner == owner) revert InvalidNewOwner();
        
        pendingOwner = newOwner;
        emit OwnershipTransferInitiated(owner, newOwner);
    }

    /// @dev Completes the ownership transfer process
    /// @dev Only the pending owner can call this function
    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert OwnershipNotPending();
        
        address previousOwner = owner;
        owner = msg.sender;
        pendingOwner = address(0);
        
        emit OwnershipTransferred(previousOwner, msg.sender);
    }

    /// @dev Cancels the pending ownership transfer
    function cancelOwnershipTransfer() external onlyOwner {
        if (pendingOwner == address(0)) revert OwnershipNotPending();
        
        address cancelledPending = pendingOwner;
        pendingOwner = address(0);
        
        emit OwnershipTransferCancelled(msg.sender, cancelledPending);
    }

    // ========== Admin - Fee Management ==========
    function setFeeAmount(uint256 _fee) external onlyOwner {
        uint256 previousFee = fee;
        fee = _fee;
        emit FeeUpdated(previousFee, _fee);
    }

    function setTreasuryAddress(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Zero address");
        address previousTreasury = treasuryAddress;
        treasuryAddress = newTreasury;
        emit TreasuryAddressUpdated(previousTreasury, newTreasury);
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
