# AOSSIE Best Practices Checklist

> Criteria adapted from the [OpenSSF Best Practices Badge](https://github.com/coreinfrastructure/best-practices-badge)
> (MIT / CC BY 3.0) by OpenSSF contributors. Modified for AOSSIE multi-repo template use.
>
> **Purpose:** Covers OpenSSF Best Practices criteria that are NOT auto-detected by OpenSSF Scorecard.
> Scorecard already handles: License, SAST tools, CI tests, Security Policy file, Branch Protection,
> Pinned Dependencies, Signed Releases, Maintained status, and Known Vulnerabilities.
>
> **How to use:**
> 1. Fill in checkboxes below — tick `[x]` for Met, leave `[ ]` for Unmet, use `[~]` for N/A
> 2. Add a brief note or URL after each item as evidence
> 3. Run the checklist-score workflow to update the badge automatically
>
> **Legend:**
> - 🔴 MUST — Required for passing
> - 🟡 SHOULD — Required unless documented rationale given
> - 🔵 SUGGESTED — Optional but recommended
> - ⚪ N/A — Mark `[~]` if not applicable, add justification

---

## Score Summary

> This repository has no `checklist-score.yml` automation yet, so this table is maintained by hand. Convention: `[~]` (N/A) rows count toward each category's `Total` but not toward `Met`, consistent with how AOSSIE's `checklist-score.yml` scores sibling repos.

| Category           | Met | Total | Status |
|--------------------|-----|-------|--------|
| Basics             | 7   | 8     | 🟡     |
| Change Control     | 3   | 6     | 🔴     |
| Reporting          | 3   | 8     | 🔴     |
| Quality            | 6   | 11    | 🔴     |
| Security           | 0   | 9     | 🔴     |
| Analysis           | 0   | 7     | 🔴     |
| **Total**          | **19** | **49** | **39%** |

---

## 🏗️ Basics

### Project Website & Documentation

- [x] 🔴 **description_good** — The project README/website clearly describes what the software does and what problem it solves.
  - *Evidence URL:* `README.md` — "Overview" section

- [x] 🔴 **interact** — The project provides information on how to obtain the software, submit bug reports, and contribute.
  - *Evidence URL:* `README.md` "Getting Started"/"Community and Support", GitHub Issues, `CONTRIBUTING.md`

- [x] 🔴 **contribution** — `CONTRIBUTING.md` explains the contribution process (e.g., PRs are used, how to open one).
  - *Evidence URL:* `CONTRIBUTING.md` — sections 3–5 (PR scope, CI requirements)

- [x] 🟡 **contribution_requirements** — `CONTRIBUTING.md` references acceptable contribution standards (coding style, tests required, etc.).
  - *Evidence URL:* `CONTRIBUTING.md` — "Test Requirements" section

- [x] 🔴 **documentation_basics** — Basic documentation exists for the software (README, Wiki, or docs folder).
  - *Evidence URL:* `README.md`, `docs/`

- [ ] 🔴 **documentation_interface** — Reference documentation describes the external interface (API inputs/outputs, CLI flags, config schema, etc.).
  - *Evidence URL:* Not present — no dedicated contract ABI / function reference beyond inline README examples

### Other Basics

- [x] 🔴 **discussion** — Project has a searchable, URL-addressable discussion mechanism (GitHub Issues, Discord with archive, mailing list, etc.) that doesn't require proprietary client software.
  - *Evidence URL:* GitHub Issues; [#chainvoice Discord channel](https://discord.com/channels/995968619034984528/1328282666335993856)

- [x] 🟡 **english** — Documentation is provided in English and English bug reports/comments are accepted.
  - *Note:* All docs and issues are in English.

---

## 🔄 Change Control

### Version Control

- [x] 🔵 **repo_distributed** — Project uses a distributed VCS (e.g., git). *(SUGGESTED)*
  - *Evidence URL:* GitHub repo, git history

### Version Numbering

- [x] 🔴 **version_unique** — Each release has a unique version identifier (e.g., v1.0.0).
  - *Evidence URL:* Git tag `v1` / GitHub Release "Mainnet deployed contract v1"

- [ ] 🔵 **version_semver** — Project uses [SemVer](https://semver.org) or [CalVer](https://calver.org/) format. *(SUGGESTED)*
  - *Note:* Current tag (`v1`) doesn't follow strict `MAJOR.MINOR.PATCH` SemVer format.

- [x] 🔵 **version_tags** — Releases are tagged in the VCS (e.g., `git tag v1.0.0`). *(SUGGESTED)*
  - *Evidence URL:* `git tag` → `v1`

### Release Notes

- [ ] 🔴 **release_notes** — Each release includes human-readable release notes summarizing major changes. Raw `git log` output is NOT acceptable.
  - *Evidence URL:* Current release note is a one-line title only, not a change summary.

- [~] 🔴 **release_notes_vulns** — Release notes identify every publicly known vulnerability (with CVE) fixed in that release.
  - *Evidence URL:* N/A — *Justification: as of 2026-08-11, no CVEs or public vulnerability disclosures exist against this repository (verified via GitHub Security Advisories for this repo). Re-verify this justification at each future release rather than treating it as permanent.*

---

## 🐛 Reporting

### Bug Reporting

- [x] 🔴 **report_process** — A bug-reporting process exists (e.g., GitHub Issues link in README).
  - *Evidence URL:* GitHub Issues

- [x] 🟡 **report_tracker** — An issue tracker (e.g., GitHub Issues) is used to track individual bugs.
  - *Evidence URL:* GitHub Issues

- [ ] 🔴 **report_responses** — A majority of bug reports submitted in the last 2–12 months have been acknowledged (response ≠ fix).
  - *Self-certification note:* Not yet assessed — needs maintainer review of issue history.

- [ ] 🟡 **enhancement_responses** — More than 50% of enhancement requests in the last 2–12 months have received a response.
  - *Self-certification note:* Not yet assessed.

- [x] 🔴 **report_archive** — Reports and responses are publicly archived and searchable (GitHub Issues satisfies this).
  - *Evidence URL:* GitHub Issues

### Vulnerability Reporting

- [ ] 🔴 **vulnerability_report_process** — A vulnerability reporting process is documented (e.g., `SECURITY.md`).
  - *Evidence URL:* Not present — no `SECURITY.md` in repo.

- [~] 🟡 **vulnerability_report_private** — If private vulnerability reporting is supported, the method for private submission is documented.
  - *Evidence URL:* N/A — *Justification: no `SECURITY.md`/private channel documented yet.*

- [~] 🔴 **vulnerability_report_response** — Initial response to any vulnerability report received in the last 6 months was within 14 days.
  - *Self-certification note:* N/A — *Justification: no reports received (no vulnerability reporting process exists yet).*

---

## ✅ Quality

### Build System

- [x] 🔴 **build** — If the project requires building, a working build system exists that can auto-rebuild from source.
  - *Evidence URL:* `frontend/package.json` (`npm run build` via Vite); `contracts/` (`forge build` via Foundry)

- [x] 🔵 **build_common_tools** — Common build tools are used (npm, pip, cargo, make, gradle, etc.). *(SUGGESTED)*
  - *Evidence URL:* npm (frontend), Foundry/forge (contracts)

- [x] 🟡 **build_floss_tools** — The project can be built using only FLOSS tools.
  - *Note:* npm/Vite and Foundry are both FLOSS.

### Automated Testing

- [x] 🔵 **test_invocation** — The test suite can be invoked in a standard way for the language (e.g., `npm test`, `pytest`, `cargo test`). *(SUGGESTED)*
  - *Evidence URL:* `npm run test:ci` (frontend, Jest), `forge test` (contracts)

- [ ] 🔵 **test_most** — The test suite covers most code branches, input fields, and functionality. *(SUGGESTED)*
  - *Estimated coverage %:* Not measured/published.

### New Functionality Testing Policy

- [ ] 🔴 **test_policy** — The project has a general policy that new functionality must include tests in the automated test suite.
  - *Evidence (CONTRIBUTING reference or informal policy):* `CONTRIBUTING.md` "Test Requirements" mandates tests only for smart contract logic changes — there's no equivalent stated policy for frontend/general functionality.

- [ ] 🔴 **tests_are_added** — Evidence exists that the test policy has been followed in recent major changes (e.g., PRs include tests).
  - *Evidence URL (recent PR with tests):* Not yet compiled — needs a sample PR link.

- [x] 🔵 **tests_documented_added** — The test policy is documented in contribution instructions. *(SUGGESTED)*
  - *Evidence URL:* `CONTRIBUTING.md` "Test Requirements"

### Linting / Warning Flags

- [x] 🔴 **warnings** — At least one linter or compiler warning flag is enabled (ESLint, Pylint, clippy, golangci-lint, Slither for Solidity, etc.).
  - *Tool used:* ESLint (`frontend/eslint.config.js`), run in CI (`.github/workflows/test.yml`)

- [ ] 🔴 **warnings_fixed** — Warnings from the linter are addressed (not suppressed without reason).
  - *Note:* CI runs lint with `continue-on-error: true` — lint failures don't currently block merges.

- [ ] 🔵 **warnings_strict** — Project uses maximum strictness in linter config where practical. *(SUGGESTED)*
  - *Note:* Not assessed.

---

## 🔐 Security

### Secure Development Knowledge

- [ ] 🔴 **know_secure_design** — At least one primary developer knows how to design secure software (familiar with OWASP, threat modeling, secure-by-default principles).
  - *Self-certification note:* To be self-certified by a maintainer.

- [ ] 🔴 **know_common_errors** — At least one primary developer knows common vulnerability types for this software's category and how to mitigate them (e.g., injection, XSS, reentrancy for Solidity, prompt injection for AI).
  - *Self-certification note:* To be self-certified by a maintainer.

### Cryptography (mark N/A if project does not handle cryptography)

- [ ] 🔴 **crypto_published** — Only publicly reviewed cryptographic protocols/algorithms are used by default.
  - *Note:* Corrected after code review — `contracts/src/Chainvoice.sol` does not call `keccak256`, `ecrecover`, or any ECDSA/ECIES function; it only stores an off-chain-computed `invoiceDataHash` and validates the byte-length/prefix of a Waku public key (`registerWakuPublicKey`, lines 124–126). The frontend's "encryption" (`frontend/src/page/CreateInvoice.jsx:528`, `CreateInvoicesBatch.jsx:618`, `BatchPayment.jsx:340`) is `btoa`/`atob` — Base64 encoding, not a cryptographic algorithm — and `dataToEncryptHash` is hardcoded to `""` rather than computed. No genuine cryptographic protocol is currently in use despite the project's intent to end-to-end encrypt invoice data via Waku.

- [~] 🟡 **crypto_call** — Project calls an established crypto library rather than reimplementing crypto functions.
  - *Library used:* N/A — no cryptographic library is called; see `crypto_published` note above.

- [ ] 🔴 **crypto_working** — No broken algorithms (MD4, MD5, single DES, RC4, Dual_EC_DRBG) used unless required for interoperability (must be documented).
  - *Note:* Base64 (`btoa`/`atob`) is not a cryptographic algorithm at all, so this criterion can't be assessed as "met" — there is no real algorithm in place to evaluate for weakness.

- [ ] 🔴 **crypto_keylength** — Key lengths meet [NIST 2030 minimums](https://www.keylength.com/en/4/) by default.
  - *Note:* The registered Waku public key is a standard uncompressed secp256k1 point (65 bytes, prefix `0x04`), which would meet minimums if used — but it is only stored/validated for format, never actually used to encrypt anything on the paths above.

- [~] 🔴 **crypto_password_storage** — Passwords for external users are stored as iterated salted hashes (Argon2id, bcrypt, scrypt, PBKDF2).
  - *Note:* N/A — *Justification: project doesn't store user passwords (wallet-based auth).*

- [ ] 🔴 **crypto_random** — Cryptographic keys and nonces are generated using a CSPRNG; insecure generators (Math.random, rand()) are NOT used for security purposes.
  - *Note:* Not yet verified — requires a contract-code audit for any on-chain randomness usage.

- [ ] 🟡 **delivery_unsigned** — Cryptographic hashes are NOT retrieved over plain HTTP without a signature check.
  - *Note:* Not assessed.

---

## 🔬 Analysis

### Static Code Analysis

- [ ] 🔴 **static_analysis_fixed** — All medium+ severity vulnerabilities found by static analysis are fixed in a timely manner after confirmation.
  - *Note:* No static analysis tool currently configured for Solidity (see below).

- [ ] 🔵 **static_analysis_common_vulnerabilities** — The static analysis tool includes checks for common vulnerabilities in the language/environment (e.g., eslint-plugin-security, bandit, Slither). *(SUGGESTED)*
  - *Tool + ruleset:* Not configured — no Slither/solhint found in repo. ESLint covers the frontend only.

- [ ] 🔵 **static_analysis_often** — Static analysis runs on every commit or at least daily (CI integration). *(SUGGESTED)*
  - *Evidence URL:* Not applicable yet — no static analysis tool configured.

### Dynamic Code Analysis

- [ ] 🔵 **dynamic_analysis** — At least one dynamic analysis tool is applied before major releases (fuzzer, web app scanner like OWASP ZAP, etc.). *(SUGGESTED)*
  - *Tool used:* Not currently used.

- [ ] 🔵 **dynamic_analysis_enable_assertions** — Dynamic analysis / testing runs with assertions enabled (not just production mode). *(SUGGESTED)*
  - *Note:* Not assessed.

- [ ] 🔴 **dynamic_analysis_fixed** — Medium+ severity vulnerabilities found by dynamic analysis are fixed in a timely manner.
  - *Note:* Not applicable yet — no dynamic analysis tool configured.

- [~] 🔵 **dynamic_analysis_unsafe** — If the project uses memory-unsafe languages (C/C++), memory safety tools (Valgrind, AddressSanitizer) are used. *(SUGGESTED)*
  - *Note:* N/A — *Justification: project uses memory-safe languages (Solidity, TypeScript/JavaScript).*

---

## 📎 Project-Specific Notes

> Add domain-specific notes here for Web3, Full-Stack, or AI projects.

### Web3 / Solidity Notes

- Scorecard does not audit Solidity-specific security. Use [Slither](https://github.com/crytic/slither) for `static_analysis` and `warnings` criteria — **not currently configured, recommended next step.**
- For `crypto_*` criteria: no genuine cryptography is currently implemented anywhere in the stack — the frontend's "encryption" of invoice data is Base64 encoding (`btoa`/`atob`), not a cipher, and the invoice data hash is never actually computed. **Recommended next step:** use the registered Waku public key (`registerWakuPublicKey`) to actually ECIES-encrypt the payload, and compute a real `keccak256` hash for `invoiceDataHash` instead of leaving it empty.
- `know_secure_design` requires evidence of a primary developer's own knowledge (training, experience, or self-certification) — a third-party audit report demonstrates external review, not developer knowledge, and should not be cited as evidence for this criterion.

### Full-Stack Notes

- Frontend is React + Vite + TypeScript, tested with Jest, linted with ESLint (CI currently `continue-on-error`).

---

*This checklist complements [OpenSSF Scorecard](https://scorecard.dev/) (auto-detected checks) and is
inspired by the [OpenSSF Best Practices Badge](https://www.bestpractices.dev/en/criteria/0) passing criteria.*
