# Remediations of Security Review Findings

Review date and time: 2026-10-02T08:41:50Z (UTC)

## Remediations

### Remediation of Finding 1: Batch payment approves an allowance built from sender-controlled decimals and amount

- [x] This remediation implements the security review's recommendation for this finding.
- [ ] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [0d075f7](https://github.com/StabilityNexus/Chainvoice/commit/0d075f781350ef068d0878f9468007b641fa96f0) (PR #247)

Description: Invoices are built from the on-chain record (`buildChainInvoice`), with the token's `decimals()` read from the token contract. Approvals cover exactly the sum of the on-chain amounts (`sumBaseUnits`).

### Remediation of Finding 2: PR previews built from fork code are served on the production origin

- [x] This remediation implements the security review's recommendation for this finding.
- [ ] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [c90ad70](https://github.com/StabilityNexus/Chainvoice/commit/c90ad707755623f71100cb045fb4cefe21d3ea96) (PR #309)

Description: PR previews are deployed to Cloudflare Pages (`chainvoice-preview.pages.dev`), a separate origin from production.

### Remediation of Finding 3: Hash-verified payload replaces the on-chain sender, amount and token in what the UI shows and pays

- [x] This remediation implements the security review's recommendation for this finding.
- [ ] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [0d075f7](https://github.com/StabilityNexus/Chainvoice/commit/0d075f781350ef068d0878f9468007b641fa96f0) (PR #247)
- [7267a15](https://github.com/StabilityNexus/Chainvoice/commit/7267a1580ee61a8eac31c675976114ab9f77e856) (PR #317)

Description: The sender, amount and token are shown and paid from the on-chain fields. Payload details are shown only when they match the on-chain record. PR #317 extends this to the invoice drawers, export and import.

### Remediation of Finding 4: Messaging-key derivation message is not bound to an origin and cannot be rotated

- [x] This remediation implements the security review's recommendation for this finding.
- [ ] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [cf7d054](https://github.com/StabilityNexus/Chainvoice/commit/cf7d0546b7532c9ac5d656c234036bcc30f0197d) (PR #238)

Description: `buildDerivationMessage` includes the origin, the wallet address and a warning not to sign the message on other sites. Cached keys are served only for the matching origin.

### Remediation of Finding 5: Tokens without a return value (e.g. USDT) can be invoiced but never paid

- [x] This remediation implements the security review's recommendation for this finding.
- [ ] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [37d64e3](https://github.com/StabilityNexus/Chainvoice/commit/37d64e3c3c50eee7298c1e7b4772fadd4291ca8c) (PR #228)

Description: Token transfers in `Chainvoice.sol` use OpenZeppelin `SafeERC20`, with tests for a token that returns no value.

### Remediation of Finding 6: Fee-on-transfer tokens mark an invoice paid while the issuer receives less

- [x] This remediation implements the security review's recommendation for this finding.
- [ ] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [37d64e3](https://github.com/StabilityNexus/Chainvoice/commit/37d64e3c3c50eee7298c1e7b4772fadd4291ca8c) (PR #228)

Description: `_pullToken` measures the issuer's balance before and after the transfer and reverts with `TokenAmountShortfall` if less than `amountDue` arrived, in both the single and batch paths.

### Remediation of Finding 7: Unpaginated getReceivedInvoices can be permanently broken for an address by free invoice spam

- [x] This remediation implements the security review's recommendation for this finding.
- [ ] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [5d75263](https://github.com/StabilityNexus/Chainvoice/commit/5d75263c7657102d22c93adadc8efa3eb606df4a) (PR #227)

Description: Sent and received invoices are read through offset/limit paginated views, newest first, and the frontend uses them.

## Non-remediated findings

None.
