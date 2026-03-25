// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Chainvoice {
    using SafeERC20 for IERC20;
    // Errors
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
        string encryptedHash; // Content hash or integrity ref
     }

    InvoiceDetails[] public invoices;
    mapping(address => uint256[]) public sentInvoices;
    mapping(address => uint256[]) public receivedInvoices;

    address public owner;
    address public treasuryAddress;
    uint256 public fee;                // native fee per invoice
    uint256 public accumulatedFees;    // native fees accrued (for withdraw)
    address public pendingOwner;  // Two-step ownership transfer

    // ========== Events ==========
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
        if (amountDue == 0) revert InvalidAmount();

        if (tokenAddress != address(0)) {
            if (tokenAddress.code.length == 0) revert NotContract();
            (bool balOk, bytes memory balData) = tokenAddress.staticcall(
                abi.encodeWithSelector(IERC20.balanceOf.selector, address(this))
            );
            (bool allowanceOk, bytes memory allowanceData) = tokenAddress.staticcall(
                abi.encodeWithSelector(IERC20.allowance.selector, address(this), address(this))
            );
            if (!balOk || balData.length < 32 || !allowanceOk || allowanceData.length < 32) {
                revert InvalidToken();
            }
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

            IERC20(invoice.tokenAddress).safeTransferFrom(
                msg.sender,
                invoice.from,
                invoice.amountDue
            );
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
                erc20.safeTransferFrom(msg.sender, inv.from, inv.amountDue);
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

        emit OwnershipTransferCancelled(msg.sender, pendingOwner);
        pendingOwner = address(0);
    }

    // ========== Admin - Fee Management ==========
    function setFeeAmount(uint256 _fee) external onlyOwner {
        emit FeeUpdated(fee, _fee);
        fee = _fee;
    }

    function setTreasuryAddress(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert ZeroAddress();

        emit TreasuryAddressUpdated(treasuryAddress, newTreasury);
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
