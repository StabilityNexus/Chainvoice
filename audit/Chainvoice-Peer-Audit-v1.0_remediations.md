# Remediations of Peer Audit Findings

Audit: Chainvoice Peer Audit Report v1.0 ([PDF](Chainvoice-Peer-Audit-v1.0.pdf)), by Rohan Shinde ([@rohans02](https://github.com/rohans02)), against commit `a36a29b` (24 Oct 2026).

All five findings are fixed on `main`, and the auditor verified each fix.

| ID | Finding | Severity | Fixed by |
|---|---|---|---|
| CV-FE-01 | Hostile `batchInfo` in a hash-valid payload crashes the Received page on every visit | Medium | PR #335, [a44ba2c](https://github.com/StabilityNexus/Chainvoice/commit/a44ba2c16a2092a47412cff76e6ec3bce6bcc6e3) |
| CV-OPS-01 | README and `.env.example` point to a retired Sepolia contract the current app cannot use | Medium | PR #335, [a44ba2c](https://github.com/StabilityNexus/Chainvoice/commit/a44ba2c16a2092a47412cff76e6ec3bce6bcc6e3) |
| CV-FE-09 | Amount inputs change silently on mouse-wheel scroll | Low | PR #335, [a44ba2c](https://github.com/StabilityNexus/Chainvoice/commit/a44ba2c16a2092a47412cff76e6ec3bce6bcc6e3) |
| CV-SC-01 | `withdrawFees()` emits no event | Informational | PR #332, [4f1a92c](https://github.com/StabilityNexus/Chainvoice/commit/4f1a92c77e3d4805860faaa68e6e9170fe0d715f) |
| CV-OPS-03 | Contradictory licence signals (GPL-3.0 repo, Unlicense contract, UNLICENSED script) | Informational | PR #332, [4f1a92c](https://github.com/StabilityNexus/Chainvoice/commit/4f1a92c77e3d4805860faaa68e6e9170fe0d715f) |

## How each was fixed

- **CV-FE-01:** `batchInfo` is accepted only with a non-empty string `batchId`, an integer `batchSize` of at least 1 and an integer `index` within the batch. Anything else is dropped, so the page renders.
- **CV-OPS-01:** README and `frontend/.env.example` list the current Sepolia, Mordor and Amoy addresses and mark the old Sepolia contract as retired.
- **CV-FE-09:** The shared `Input` component blurs number inputs on wheel, which covers every amount, quantity, discount and tax field.
- **CV-SC-01:** `withdrawFees()` emits `DevFeesWithdrawn(caller, devFeeReceiver, amount)` before the transfer, with tests.
- **CV-OPS-03:** Following Bruno's decision, every Solidity file declares `SPDX-License-Identifier: UNLICENSED` with a comment linking to the repository licence.

The minor observations noted during functional testing (UI, accessibility and hardening items with no risk to funds) are tracked for after launch.
