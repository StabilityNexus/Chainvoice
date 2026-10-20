// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.19;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

contract Chainvoice {
    // Tokens that return nothing from transferFrom (USDT and others) would
    // otherwise make every payment revert while the return value is decoded.
    using SafeERC20 for IERC20;

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
    error TokenAmountShortfall();
    error NoPendingDev();
    error NoFeesAvailable();
    error WithdrawFailed();
    error InvalidPublicKey();
    error InvalidInvoiceHash();
    error InvalidPageLimit();

    // ========== Storage ==========
    struct InvoiceDetails {
        uint256 id;
        address from;
        address to;
        uint256 amountDue;
        address tokenAddress;     // address(0) == native
        bool isPaid;
        bool isCancelled;
        bytes32 invoiceDataHash;  // keccak256 hash of plaintext invoice data
     }

    InvoiceDetails[] public invoices;
    mapping(address => uint256[]) public sentInvoices;
    mapping(address => uint256[]) public receivedInvoices;

    // ========== Messaging Public Key Registry ==========
    mapping(address => bytes) private messagingPublicKeys;

    /// @notice Sets devFee and devFeeReceiver, and hands its own role to a
    ///         successor in two steps. There is no contract owner.
    address public dev;
    /// @notice Address proposed as the next dev; zero when none is pending.
    address public pendingDev;
    /// @notice Receives withdrawn fees. May be a contract that cannot call back
    ///         into Chainvoice, such as a vault, so it is changed in one step.
    address public devFeeReceiver;
    uint256 public devFee;             // native fee per invoice
    uint256 public accumulatedDevFees; // native fees accrued (for withdraw)

    // ========== Events ==========
    event InvoiceCreated(uint256 indexed id, address indexed from, address indexed to, address tokenAddress);
    event InvoicePaid(uint256 indexed id, address indexed from, address indexed to, uint256 amount, address tokenAddress);
    event InvoiceCancelled(uint256 indexed id, address indexed from, address indexed to, address tokenAddress);
    event InvoiceBatchCreated(address indexed creator, address indexed token, uint256 count, uint256[] ids);
    event InvoiceBatchPaid(address indexed payer, address indexed token, uint256 count, uint256 totalAmount, uint256[] ids);
    event PublicKeyRegistered(address indexed user, bytes publicKey);

    event DevFeeUpdated(uint256 indexed previousDevFee, uint256 indexed newDevFee);
    event DevFeeReceiverUpdated(address indexed previousDevFeeReceiver, address indexed newDevFeeReceiver);
    event DevProposed(address indexed currentDev, address indexed proposedDev);
    event DevProposalCancelled(address indexed currentDev, address indexed cancelledDev);
    event DevUpdated(address indexed previousDev, address indexed newDev);

    /// @param _devFee Native fee charged per paid invoice; must be non-zero.
    /// @param _dev Address that sets devFee and devFeeReceiver; must not be zero.
    /// @param _devFeeReceiver Address that withdrawn fees are paid to; must not be zero.
    constructor(uint256 _devFee, address _dev, address _devFeeReceiver) {
        // A zero fee is rejected here only to catch an unset DEV_FEE_WEI at deploy
        // time. The dev may still set the fee to 0 later via setDevFee(); that
        // is a deliberate choice, not a misconfiguration.
        if (_devFee == 0) revert InvalidAmount();
        if (_dev == address(0) || _devFeeReceiver == address(0)) revert ZeroAddress();
        devFee = _devFee;
        dev = _dev;
        devFeeReceiver = _devFeeReceiver;
        emit DevFeeUpdated(0, _devFee);
        emit DevUpdated(address(0), _dev);
        emit DevFeeReceiverUpdated(address(0), _devFeeReceiver);
    }

    // ========== Modifiers ==========
    modifier onlyDev() {
        if (msg.sender != dev) revert Unauthorized();
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
    /// @notice Largest batch payInvoicesBatch accepts. At 50 invoices it measures
    ///         about 2.2M gas for native invoices from one issuer, 3.5M worst case
    ///         (50 fresh issuers, so every payout creates an account), and 2.5M
    ///         worst case for ERC-20 invoices.
    uint256 public constant MAX_BATCH = 50;
    /// @notice Largest batch createInvoicesBatch accepts. Creating writes several
    ///         fresh storage slots per invoice, about 185k gas each for native
    ///         invoices and 205k for ERC-20. 30 invoices cost about 5.6M and 6.2M
    ///         gas worst case, which fits Ethereum Classic's 8M block gas limit;
    ///         40 would already exceed it with an ERC-20 token.
    uint256 public constant MAX_CREATE_BATCH = 30;
    uint256 public constant MAX_PAGE_LIMIT = 50;

    // ========== Internal Utils ==========
    function _validateToken(address tokenAddress) private view {
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

    /// @dev Move `amount` of `token` from `payer` to `payee` and require the
    ///      payee to have received all of it. A fee-on-transfer token (or one
    ///      that switches a fee on later) would otherwise settle the invoice
    ///      in full while the issuer is paid short.
    function _pullToken(IERC20 token, address payer, address payee, uint256 amount) private {
        uint256 before = token.balanceOf(payee);
        token.safeTransferFrom(payer, payee, amount);
        uint256 afterBal = token.balanceOf(payee);
        // Both callers are nonReentrant, so `before` can't go stale mid-call.
        // slither-disable-next-line reentrancy-balance
        if (afterBal < before || afterBal - before < amount) revert TokenAmountShortfall();
    }

    // ========== Messaging Key Management ==========
    /// @notice Register or update the caller's ECIES public key.
    /// @dev Used by clients to encrypt invoice payloads for this address. The
    ///      registry is transport-agnostic: it says nothing about how the
    ///      encrypted payload is delivered.
    /// @param publicKey The uncompressed secp256k1 public key (65 bytes).
    function registerPublicKey(bytes calldata publicKey) external {
        if (publicKey.length != 65 || publicKey[0] != 0x04) revert InvalidPublicKey();
        messagingPublicKeys[msg.sender] = publicKey;
        emit PublicKeyRegistered(msg.sender, publicKey);
    }

    /// @notice Get a user's registered ECIES public key.
    /// @param user The address to look up.
    /// @return The public key bytes (empty if not registered).
    function getPublicKey(address user) external view returns (bytes memory) {
        return messagingPublicKeys[user];
    }

    // ========== Single-invoice create ==========
    function createInvoice(
        address to,
        uint256 amountDue,
        address tokenAddress,
        bytes32 invoiceDataHash
    ) external {
        if (invoiceDataHash == bytes32(0)) revert InvalidInvoiceHash();
        if (to == address(0)) revert ZeroAddress();
        if (to == msg.sender) revert SelfInvoicing();
        if (amountDue == 0) revert InvalidAmount();

        if (tokenAddress != address(0)) {
            _validateToken(tokenAddress);
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
                invoiceDataHash: invoiceDataHash
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
        bytes32[] calldata invoiceDataHashes
    ) external {
        uint256 n = tos.length;
        if (n == 0 || n > MAX_CREATE_BATCH) revert InvalidBatchSize();
        
        if (
            n != amountsDue.length ||
            n != invoiceDataHashes.length
        ) revert ArrayLengthMismatch();

        if (tokenAddress != address(0)) {
            _validateToken(tokenAddress);
        }

        uint256[] memory ids = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            address to = tos[i];
            if (invoiceDataHashes[i] == bytes32(0)) revert InvalidInvoiceHash();
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
                    invoiceDataHash: invoiceDataHashes[i]
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
            if (msg.value != invoice.amountDue + devFee) revert IncorrectPaymentAmount();
            accumulatedDevFees += devFee;

            (bool sent, ) = payable(invoice.from).call{value: invoice.amountDue}("");
            if (!sent) revert NativeTransferFailed();
        } else {
            if (msg.value != devFee) revert FeeMustBeNative();
            if (IERC20(invoice.tokenAddress).allowance(msg.sender, address(this)) < invoice.amountDue) {
                revert InsufficientAllowance();
            }
            accumulatedDevFees += devFee;

            _pullToken(IERC20(invoice.tokenAddress), msg.sender, invoice.from, invoice.amountDue);
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
        uint256 totalNativeFee = devFee * n;
        // Validate and mark paid in the same pass so a duplicate id in the
        // batch hits AlreadySettled() on its second occurrence, before any
        // funds move.
        for (uint256 i = 0; i < n; i++) {
            uint256 id = invoiceIds[i];
            if (id >= invoices.length) revert InvalidInvoiceId();

            InvoiceDetails storage inv = invoices[id];

            if (msg.sender != inv.to) revert NotAuthorizedPayer();
            if (inv.isPaid || inv.isCancelled) revert AlreadySettled();
            if (inv.tokenAddress != token) revert MixedTokenBatch();

            totalAmounts += inv.amountDue;
            inv.isPaid = true;
        }
        accumulatedDevFees += totalNativeFee;
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
                _pullToken(erc20, msg.sender, inv.from, inv.amountDue);
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

        if (invoice.isCancelled || invoice.isPaid) {
            return (false, payer.balance, 0);
        }

        if (invoice.tokenAddress == address(0)) {
            // Native
            return (
                payer.balance >= invoice.amountDue + devFee,
                payer.balance,
                type(uint256).max // Native has no allowance
            );
        } else {
            uint256 bal = IERC20(invoice.tokenAddress).balanceOf(payer);
            uint256 allw = IERC20(invoice.tokenAddress).allowance(payer, address(this));
            // The fee is charged in native currency on the token path too.
            return (
                bal >= invoice.amountDue && allw >= invoice.amountDue && payer.balance >= devFee,
                bal,
                allw
            );
        }
    }

    /// @notice Get one page of the invoices a user has sent, newest first.
    /// @param user The sender to look up.
    /// @param offset How many of the newest invoices to skip.
    /// @param limit Maximum number of invoices to return (1 to MAX_PAGE_LIMIT).
    /// @return page Up to `limit` invoices starting at the `offset`-th newest; empty if offset >= total.
    /// @return total The number of invoices the user has sent.
    function getSentInvoices(
        address user,
        uint256 offset,
        uint256 limit
    ) external view returns (InvoiceDetails[] memory page, uint256 total) {
        return _getInvoicesPage(sentInvoices[user], offset, limit);
    }

    /// @notice Get one page of the invoices a user has received, newest first.
    /// @param user The recipient to look up.
    /// @param offset How many of the newest invoices to skip.
    /// @param limit Maximum number of invoices to return (1 to MAX_PAGE_LIMIT).
    /// @return page Up to `limit` invoices starting at the `offset`-th newest; empty if offset >= total.
    /// @return total The number of invoices the user has received.
    function getReceivedInvoices(
        address user,
        uint256 offset,
        uint256 limit
    ) external view returns (InvoiceDetails[] memory page, uint256 total) {
        return _getInvoicesPage(receivedInvoices[user], offset, limit);
    }

    /// @dev Copies one page of ids into memory newest first: element i is
    ///      ids[total - 1 - offset - i], so offset 0 starts at the most recently
    ///      added invoice. The bounded limit keeps the loop, and so the call's gas,
    ///      independent of how many invoices a user has.
    function _getInvoicesPage(
        uint256[] storage ids,
        uint256 offset,
        uint256 limit
    ) internal view returns (InvoiceDetails[] memory page, uint256 total) {
        if (limit == 0 || limit > MAX_PAGE_LIMIT) revert InvalidPageLimit();

        total = ids.length;
        if (offset >= total) return (new InvoiceDetails[](0), total);

        // offset < total here, so total - offset cannot underflow; any larger
        // offset returned above. i < len <= total - offset keeps the index
        // total - 1 - offset - i at or above zero.
        uint256 remaining = total - offset;
        uint256 len = remaining > limit ? limit : remaining;
        page = new InvoiceDetails[](len);
        for (uint256 i = 0; i < len; i++) {
            page[i] = invoices[ids[total - 1 - offset - i]];
        }
    }

    function getInvoice(uint256 invoiceId) external view returns (InvoiceDetails memory) {
        if (invoiceId >= invoices.length) revert InvalidInvoiceId();
        return invoices[invoiceId];
    }

    // ========== Fee Management ==========
    function setDevFee(uint256 newDevFee) external onlyDev {
        emit DevFeeUpdated(devFee, newDevFee);
        devFee = newDevFee;
    }

    function setDevFeeReceiver(address newDevFeeReceiver) external onlyDev {
        if (newDevFeeReceiver == address(0)) revert ZeroAddress();

        emit DevFeeReceiverUpdated(devFeeReceiver, newDevFeeReceiver);
        devFeeReceiver = newDevFeeReceiver;
    }

    // ========== Dev Handover (two-step) ==========
    /// @notice Propose a new dev. Nothing changes until that address
    ///         calls acceptDev(); proposing again replaces the pending address.
    function proposeDev(address newDev) external onlyDev {
        if (newDev == address(0)) revert ZeroAddress();

        pendingDev = newDev;
        emit DevProposed(dev, newDev);
    }

    /// @notice Withdraw a pending proposal, for example one sent to a mistyped
    ///         address. The current dev keeps its role.
    function cancelDevProposal() external onlyDev {
        address pending = pendingDev;
        if (pending == address(0)) revert NoPendingDev();

        pendingDev = address(0);
        emit DevProposalCancelled(dev, pending);
    }

    /// @notice Complete the handover. Only the proposed address can call this.
    function acceptDev() external {
        address pending = pendingDev;
        if (pending == address(0)) revert NoPendingDev();
        if (msg.sender != pending) revert Unauthorized();

        emit DevUpdated(dev, pending);
        dev = pending;
        pendingDev = address(0);
    }

    function withdrawFees() external {
        if (accumulatedDevFees == 0) revert NoFeesAvailable();

        uint256 amount = accumulatedDevFees;
        accumulatedDevFees = 0;

        // Destination is always devFeeReceiver, so a permissionless trigger is safe.
        // slither-disable-next-line arbitrary-send-eth
        (bool success, ) = payable(devFeeReceiver).call{value: amount}("");
        if (!success) revert WithdrawFailed();
    }
}
