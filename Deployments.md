# Deployments

All deployments of contracts in this repo, including test/beta versions, are documented in this file.
This file lists the addresses of the contracts that have been deployed
as well as the constructor parameters that have been used.

| Network | Network ID | Version | Contract `Chainvoice.sol` Address | Contract `Chainvoice.sol` Parameters | Comments |
|---|---|---|---|---|---|
| Ethereum Classic | 61 | [v1](https://github.com/StabilityNexus/Chainvoice/releases/tag/v1) | `0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Mainnet |
| Polygon | 137 | [v1](https://github.com/StabilityNexus/Chainvoice/releases/tag/v1) | `0xD044A85a5daC307217B9bF313A90E8a60AF7DdCe` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Mainnet |
| Ethereum Sepolia | 11155111 | [v1](https://github.com/StabilityNexus/Chainvoice/releases/tag/v1) | `0x54a542dCDC306eE281b5De4613EcEfe6e6ABc562` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Testnet |
| Ethereum Sepolia | 11155111 | Public key registry (`registerPublicKey` / `getPublicKey`), hash-based invoice storage | `0x65eb0ca96f972c5a0cdaa623a5b54650e499df5b` | None — constructor takes no arguments (`owner = msg.sender`, `fee` hardcoded to `0.0005 ether`) | Testnet. Current deployment the frontend targets. |
| Ethereum Sepolia | 11155111 | `main` at `7b9f0405` (`dev` / `devFee` / `devFeeReceiver`) | `0x094642FEbF43d17C44dbe07b74AE3A18fEdC7390` | `devFee = 0.0005 ether`, `dev = devFeeReceiver = 0x69fF0f180e74112cF707DdDEC729095631c4B809` | Testnet. PR previews only (`frontend/.env.preview`), so they share no keys or invoices with production. |

> ⚠️ **The v1 rows are incompatible with the current contract.** The key registry
> functions were renamed (`registerPublicKey` / `getPublicKey`), which changed
> their selectors, and invoice payloads moved off-chain behind a `bytes32` hash.
> Only the Sepolia row above marked as the current deployment matches the ABI in
> this repo. Ethereum Classic and Polygon still run v1 and need redeploying
> before those networks can be enabled.

---
**Note to Developers:** After making a new deployment, please:
1. create a git tag for the deployed version;
2. add a new row to the table above with the details of the deployment.

---

## Frontend site

The frontend is served by GitHub Pages from the **`gh-pages` branch**, published
by `.github/workflows/deploy.yml` on every push to `main` that touches
`frontend/`. Each deploy replaces the whole branch with the new build.

`.github/scripts/pages-config.sh` asks the Pages API where the site lives, so a
fork with no custom domain builds for `/<repo>/` and this repository builds
for `/`. A fork needs GitHub Pages enabled (Settings → Pages → any source), or a
`PAGES_SITE_URL` repository variable set to the site root, e.g.
`https://<owner>.github.io/Chainvoice/`.

Leave Settings → Actions → General → Workflow permissions at **read-only**.
That setting is the token every workflow gets when it declares no `permissions:`
of its own, so raising it hands write access to whichever future workflow forgets
to ask. Each workflow here asks per job instead.

## PR previews

A pull request that changes `frontend/` gets a preview at
`https://pr-<n>.chainvoice-preview.pages.dev/`, on Cloudflare Pages.

Previews are kept off the production origin on purpose. A preview runs code
nobody has merged yet, and on `chainvoice.stability.nexus` that code could read
the invoices people store in the browser there, ask for the signature their
messaging keys are derived from, and change the production database.

| Workflow | Runs on | Does |
|---|---|---|
| `pr-build.yml` | `pull_request`, in the PR's own context, no secrets | Builds the preview and uploads it as an artifact |
| `pr-deploy.yml` | `workflow_run`, in this repository's context | Decides whether the PR may have a preview, publishes it, deletes superseded and closed previews, comments the URL |
| `pr-preview-approval.yml` | `pull_request_target`, API calls only | Records a maintainer's approval, and withdraws it on new commits |
| `pr-preview-sweep.yml` | Weekly, or by hand | Deletes whatever cleanup missed |

### Who gets a preview

- **Contributors with write access** get one on every push, without asking.
- **Everyone else** waits for a maintainer to review the code and add the
  `preview` label. Otherwise anyone could open a pull request and have a page of
  their choosing, such as a fake wallet prompt, hosted on the preview domain.
  The label approves the commit the pull request is at when it is added: the
  approval is recorded as a `pr-preview/approved` commit status on that commit,
  which a fork cannot forge. A new push removes the label and needs approving
  again; until then the last approved preview stays up.
- Adding the label takes write access. A label added by anyone else is taken
  back off.

### Cleanup

Cloudflare keeps every upload reachable at its own permanent
`<hash>.chainvoice-preview.pages.dev` address, not only at the `pr-<n>` alias.
So `pr-deploy.yml` deletes a pull request's older uploads after each new one,
and all of them when the pull request closes. `pr-preview-sweep.yml` runs every
Monday and deletes the deployments of closed pull requests and any superseded
upload that a failed or cancelled run left behind; run it from the Actions tab to
sweep straight away.

### What a preview build gets

`frontend/.env.preview`, loaded by `vite build --mode preview` — committed, and
not from secrets or variables. GitHub passes neither to a workflow triggered by
a pull request from a fork, and a fork's code has to be built somewhere that has
no token worth stealing. Nothing in that file is a credential — Vite inlines
every `VITE_` value into the bundle it emits.

- **Contract:** a Sepolia deployment of the previews' own (see the table
  above). Messaging keys are derived from the site's origin, so a wallet gets a
  different key on every preview; on production's contract, registering one
  would replace that person's production key.
- **Relay:** `thrubox-dev-server.onrender.com`, which accepts any origin. The
  production relay only accepts the production site, so previews cannot reach
  it.
- **Networks:** only `VITE_CONTRACT_ADDRESS_11155111` is set, which is the whole
  of what keeps a preview on testnet: the app treats a network as supported
  exactly when its contract address is non-empty.

### Setup

The workflows need, on this repository:

- Secrets `CLOUDFLARE_API_TOKEN` (an account API token with only
  **Cloudflare Pages: Edit**) and `CLOUDFLARE_ACCOUNT_ID`.
- A `preview` label.
- Optionally a `CLOUDFLARE_PAGES_PROJECT` variable, when the Pages project is
  not called `chainvoice-preview`. A fork testing these workflows should point
  it at a project of its own, so its `pr-<n>` numbers cannot collide with this
  repository's.

The Pages project is a Direct Upload project — not connected to Git, so
Cloudflare never builds anything itself. Its root,
`chainvoice-preview.pages.dev`, serves a placeholder page saying the domain only
hosts previews.

Moving previews to another Cloudflare account takes a Direct Upload project
there and those two secrets replaced; the hostname then follows the new project's
name.
