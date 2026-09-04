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
`frontend/`.

A branch rather than the Pages Actions artifact, because the artifact replaces
the whole site on every deploy and so leaves nowhere for a per-pull-request
preview to live. `pr-preview/pr-<n>/` on the same branch is where those go; the
production deploy replaces the site root and leaves that tree alone.

Neither workflow hardcodes where the site is: `.github/scripts/pages-config.sh`
asks the Pages API, so a fork with no custom domain builds for
`/<repo>/` and this repository builds for `/`. Nothing needs configuring on a
fork for previews to work there.

### One-time switch to branch-based Pages

Do these in order. Selecting the branch before it exists is not possible, and
switching before the branch has a `CNAME` file would drop the custom domain.

1. Merge the workflows to `main`.
2. Run **Deploy static content to Pages** manually (Actions → the workflow →
   Run workflow). It creates `gh-pages` with the built site and a `CNAME`.
   Pages is still serving the old artifact at this point, so nothing changes
   for visitors.
3. Settings → Pages → Source → **Deploy from a branch** → `gh-pages` / `/ (root)`.

Leave Settings → Actions → General → Workflow permissions at **read-only**.
That setting is the token every workflow gets when it declares no `permissions:`
of its own, so raising it hands write access to whichever future workflow forgets
to ask. Each workflow here asks per job instead. If the publish step in step 2
fails with a 403, that is the signal to raise it — not before.

Previews appear once step 3 is done, and only for pull requests that get a new
`PR Preview: Build` run afterwards — a push, or closing and reopening.

### Forks

A fork needs GitHub Pages enabled (Settings → Pages → any source) before a
preview can be published, because `pages-config.sh` reads the site's address
from the Pages API and fails rather than guess — a wrong base path is invisible
until someone opens the site. Where the API is not an option, set a
`PAGES_SITE_URL` repository variable to the site root instead, e.g.
`https://<owner>.github.io/Chainvoice/`.

### What a preview build gets

Only `VITE_CONTRACT_ADDRESS_11155111`, so a preview reaches Ethereum Sepolia and
nothing else: the app treats any network with a non-empty contract address as
supported, so omitting the rest is all it takes to keep previews on testnet.
Relay settings come from repository variables, the same ones production uses.
