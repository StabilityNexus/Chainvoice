// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract Chainvoice {
    // ========== Errors ==========
    // Existing
    error MixedTokenBatch();
    error InvalidBatchSize();
    error AlreadySettled();
    error NotAuthorizedPayer();
    error IncorrectNativeValue();
    error InsufficientAllowance();
    
    // New Custom Errors (Replacing Strings)
    error Unauthorized();
    error Reentrancy();
    error ZeroAddress();
    error SelfInvoicing();
    error NotContract();
    error InvalidToken();
    error ArrayLengthMismatch();
    error InvalidAmount();
    error InvalidInvoiceId();
    error NotInvoiceCreator();
    error InvoiceNotCancellable();
    error InvoiceAlreadyPaid();
    error InvoiceCancelledError();
    error IncorrectPaymentAmount();
    error NativeTransferFailed();
    error FeeMustBeNative();
    error TokenTransferFailed();
    error TreasuryNotSet();
    error NoFeesAvailable();
    error WithdrawFailed();

    // ========== Storage ==========
    struct InvoiceDetails {
        uint256 id;
        address from;
        address to;
        uint256 amountDue;
        address tokenAddress;     // address(0) == native
        bool isPaid;
        bool isCancelled;
        string encryptedInvoiceData; // Base64-encoded ciphertext
        string encryptedHash;
        // Content hash or integrity ref
    }

    InvoiceDetails[] public invoices;
    mapping(address => uint256[]) public sentInvoices;
    mapping(address => uint256[]) public receivedInvoices;

    address public owner;
    address public treasuryAddress;
    uint256 public fee; // native fee per invoice
    uint256 public accumulatedFees; // native fees accrued (for withdraw)

    // ========== Events ==========
    event InvoiceCreated(uint256 indexed id, address indexed from, address indexed to, address tokenAddress);
    event InvoicePaid(uint256 indexed id, address indexed from, address indexed to, uint256 amount, address tokenAddress);
    event InvoiceCancelled(uint256 indexed id, address indexed from, address indexed to, address tokenAddress);
    event InvoiceBatchCreated(address indexed creator, address indexed token, uint256 count, uint256[] ids);
    event InvoiceBatchPaid(address indexed payer, address indexed token, uint256 count, uint256 totalAmount, uint256[] ids);

    // ========== Constructor ==========
    constructor() {
        owner = msg.sender;
        fee = 0.0005 ether;
    }

    // ========== Modifiers ==========
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    // Simple non-reentrancy guard
    bool private _entered;
    modifier nonReentrant() {
        if (_entered) revert Reentrancy();
        _entered = true;
        _;
        _entered = false;
    }

    // Constants
    uint256 public constant MAX_BATCH = 50;

    // ========== Internal Utils ==========
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
        if (to == address(0)) revert ZeroAddress();
        if (to == msg.sender) revert SelfInvoicing();

        if (tokenAddress != address(0)) {
            if (tokenAddress.code.length == 0) revert NotContract();
            (bool success, ) = tokenAddress.staticcall(
                abi.encodeWithSignature("balanceOf(address)", address(this))
            );
            if (!success) revert InvalidToken();
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
        
        if (
            n != amountsDue.length ||
            n != encryptedPayloads.length ||
            n != encryptedHashes.length
        ) revert ArrayLengthMismatch();

        if (tokenAddress != address(0)) {
             if (tokenAddress.code.length == 0) revert NotContract();
            (bool ok, ) = tokenAddress.staticcall(
                abi.encodeWithSignature("balanceOf(address)", address(this))
            );
            if (!ok) revert InvalidToken();
        }

        uint256[] memory ids = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            address to = tos[i];
            if (to == address(0)) revert ZeroAddress();
            if (to == msg.sender) revert SelfInvoicing();
            uint256 amt = amountsDue[i];
            if (amt == 0) revert InvalidAmount();

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
        if (invoiceId >= invoices.length) revert InvalidInvoiceId();
        InvoiceDetails storage invoice = invoices[invoiceId];

        if (msg.sender != invoice.from) revert NotInvoiceCreator();
        if (invoice.isPaid || invoice.isCancelled) revert InvoiceNotCancellable();
        
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
        if (invoiceId >= invoices.length) revert InvalidInvoiceId();
        InvoiceDetails storage invoice = invoices[invoiceId];
        
        if (msg.sender != invoice.to) revert NotAuthorizedPayer();
        if (invoice.isPaid) revert InvoiceAlreadyPaid();
        if (invoice.isCancelled) revert InvoiceCancelledError();

        // Effects first for CEI (mark paid, bump fees), then interactions
        invoice.isPaid = true;
        if (invoice.tokenAddress == address(0)) {
            if (msg.value != invoice.amountDue + fee) revert IncorrectPaymentAmount();
            accumulatedFees += fee;

            (bool sent, ) = payable(invoice.from).call{value: invoice.amountDue}("");
            if (!sent) revert NativeTransferFailed();
        } else {
            if (msg.value != fee) revert FeeMustBeNative();
            if (IERC20(invoice.tokenAddress).allowance(msg.sender, address(this)) < invoice.amountDue) {
                revert InsufficientAllowance();
            }
            accumulatedFees += fee;

            bool transferSuccess = IERC20(invoice.tokenAddress).transferFrom(
                msg.sender,
                invoice.from,
                invoice.amountDue
            );
            if (!transferSuccess) revert TokenTransferFailed();
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
        uint256 firstId = invoiceIds[0];
        
        if (firstId >= invoices.length) revert InvalidInvoiceId();
        
        InvoiceDetails storage inv0 = invoices[firstId];
        if (msg.sender != inv0.to) revert NotAuthorizedPayer();
        if (inv0.isPaid || inv0.isCancelled) revert AlreadySettled();
        address token = inv0.tokenAddress;

        uint256 totalAmounts = 0;
        uint256 totalNativeFee = fee * n;
        // Validate and sum
        for (uint256 i = 0; i < n; i++) {
            uint256 id = invoiceIds[i];
            if (id >= invoices.length) revert InvalidInvoiceId();

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
                if (!sent) revert NativeTransferFailed();
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
                if (!ok) revert TokenTransferFailed();
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
        if (invoiceId >= invoices.length) revert InvalidInvoiceId();
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
        if (invoiceId >= invoices.length) revert InvalidInvoiceId();
        return invoices[invoiceId];
    }

    // ========== Admin ==========
    function setFeeAmount(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function setTreasuryAddress(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert ZeroAddress();
        treasuryAddress = newTreasury;
    }

    function withdrawFees() external {
        if (treasuryAddress == address(0)) revert TreasuryNotSet();
        if (accumulatedFees == 0) revert NoFeesAvailable();

        uint256 amount = accumulatedFees;
        accumulatedFees = 0;

        (bool success, ) = payable(treasuryAddress).call{value: amount}("");
        if (!success) revert WithdrawFailed();
    }
}
