# Running Chainvoice with Docker

`docker compose up` starts the frontend **and** a [ThruBox](https://github.com/AOSSIE-Org/ThruBox-Server)
relay, wired together. That second part matters: every invoice send and receive
travels over the relay, and nothing in this repository used to start one, so a
new contributor had to clone ThruBox separately before invoicing worked at all.
Until they did, the app loaded but sharing failed in ways that looked like app
bugs.

Docker is optional. The [Local Setup](../frontend/README.md#local-setup) steps
still work exactly as before.

## Prerequisites

- **Docker Engine 20.10+** with **Docker Compose v2.24 or newer**
  (`docker compose version`). 2.24 is where the optional `env_file` syntax used
  below landed.
- **Docker Buildx** (`docker buildx version`), used once to build the relay
  image. Docker Desktop bundles it; on Linux it is a separate package
  (`docker-buildx-plugin`), so check for it rather than assuming.
- No Node.js and no Go toolchain — both run inside containers.

## First run

**1. Create your environment file.** Compose reads `frontend/.env`, the same
file the non-Docker setup uses:

```bash
cp frontend/.env.example frontend/.env
```

Add your WalletConnect Project ID from the [Reown dashboard](https://dashboard.reown.com/)
to that file. The app starts without it, but wallet connection will not work:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_reown_project_id
```

Leave `VITE_RELAY_URL` alone — Compose overrides it for the containers.

**2. Build the relay image.** Once, and again only when you want a newer
ThruBox:

```bash
docker buildx build -t chainvoice/thrubox-relay:main "https://github.com/AOSSIE-Org/ThruBox-Server.git#main"
```

This uses ThruBox's own `Dockerfile` straight from its repository — nothing is
vendored into Chainvoice, so there is no copy here to drift out of sync.

> **Why this is a separate command.** The Compose specification does list a git
> URL as a valid `build.context`, but current Compose does not honour it: it
> resolves the value against the project directory before the builder sees it,
> so `https://github.com/...` becomes a local path and the build fails before it
> starts. Verified on Docker 29.6.1 / Compose v5.1.4 with the `https://`,
> `git://` and scheme-less forms, all of which fail the same way; `docker buildx
> build` accepts the identical URL. Should a later Compose release fix this, the
> `relay` service can take a `build.context` and this step can go away.
>
> ThruBox does not publish an image yet either — the `dockers` block in its
> `.goreleaser.yaml` is commented out — so once it does, this step becomes a
> plain registry pull instead.

**3. Start the stack:**

```bash
docker compose up --build
```

| Service | URL | What it is |
| --- | --- | --- |
| `frontend` | <http://localhost:5173> | Vite dev server, hot reload |
| `relay` | <http://localhost:3000> | ThruBox relay |

Edits to `frontend/` reload in the browser as usual — your working copy is
bind-mounted into the container.

Stop with `Ctrl+C`, or `docker compose down` from another terminal.

## How the relay is wired

Worth understanding, because it looks wrong at first glance. Compose sets
`VITE_RELAY_URL=http://relay:3000` for the frontend container, and `relay` is a
name only Docker's internal DNS can resolve — your browser certainly cannot.

That is fine, because the browser never uses it. In development,
`resolveBaseUrl()` in [`frontend/src/services/relay/relayClient.js`](../frontend/src/services/relay/relayClient.js)
always points the browser at `<origin>/relay`, ignoring `VITE_RELAY_URL`
entirely. The variable is only the **target of the Vite dev server's proxy**
(see `server.proxy` in `frontend/vite.config.js`), and that proxy runs inside
the container, where `relay` resolves perfectly.

The upshot is that the browser only ever makes same-origin requests, so the
relay's lack of CORS headers never comes up.

## Useful commands

```bash
docker compose up --build          # start (rebuild if the Dockerfile changed)
docker compose up -d               # start in the background
docker compose logs -f frontend    # follow one service's logs
docker compose down                # stop and remove containers
docker compose down -v             # ...and wipe relayed messages
docker compose exec frontend sh    # a shell inside the frontend container
```

Run the test suite and linter in the container the same way:

```bash
docker compose exec frontend npm run lint
docker compose exec frontend npm test
```

## Configuration

Compose reads these from your shell, so `FRONTEND_PORT=3001 docker compose up`
works:

| Variable | Default | Purpose |
| --- | --- | --- |
| `FRONTEND_PORT` | `5173` | Host port for the dev server |
| `RELAY_PORT` | `3000` | Host port for the relay |
| `FRONTEND_PROD_PORT` | `8080` | Host port for the production profile |
| `RELAY_IMAGE` | `chainvoice/thrubox-relay:main` | Relay image to run |

Everything else — contract addresses, WalletConnect ID, relay timeout — comes
from `frontend/.env`, documented in
[`frontend/README.md`](../frontend/README.md#environment-variables).

## Production profile

The `prod` profile builds the real bundle and serves it through nginx, which
also proxies `/relay`:

```bash
docker compose --env-file frontend/.env --profile prod up frontend-prod --build
```

Naming `frontend-prod` matters: the `frontend` dev service belongs to no
profile, so it starts alongside the production container otherwise, and both
would compete for your CPU. The relay still comes up on its own through
`depends_on`.

That publishes <http://localhost:8080>. It is the same-origin deployment that
`frontend/.env.example` recommends as the CORS-free option — `VITE_RELAY_URL`
is fixed to the path `/relay`, and nginx forwards it to the relay, so the
browser never makes a cross-origin request. Use it to check a production build
locally, or as a starting point for self-hosting.

Because Vite inlines `VITE_`-prefixed values at build time, the production
image takes them as **build arguments**, not runtime environment. That is why
`--env-file frontend/.env` is on the command above: without it Compose
interpolates from a project-level `.env` at the repository root, which does not
exist here, and every build argument falls back to its default — so your
WalletConnect ID and contract addresses would silently not reach the bundle.

Changing any of those values means rebuilding **and** recreating the container;
restarting is not enough, because the values are already baked into the image:

```bash
docker compose --env-file frontend/.env --profile prod build frontend-prod
docker compose --env-file frontend/.env --profile prod up frontend-prod
```

## Troubleshooting

**Wallet connection does nothing.** `VITE_WALLETCONNECT_PROJECT_ID` is missing
from `frontend/.env`. Add it and restart.

**`pull access denied for chainvoice/thrubox-relay`.** The relay image has not
been built yet — step 2 above.

**Invoices never arrive.** Check the relay is healthy:
`curl http://localhost:3000/health` should return `{"status":"ok",...}`. Then
check it through the proxy the app actually uses:
`curl http://localhost:5173/relay/health`.

**Port already in use.** Something else holds 5173 or 3000. Override it:
`FRONTEND_PORT=5174 docker compose up`.

**Edits do not trigger a reload.** The frontend container sets
`CHOKIDAR_USEPOLLING=true`, because bind mounts do not deliver filesystem
events reliably on Windows and macOS hosts. If polling is pinning a CPU core
and you are on Linux, drop that variable from `docker-compose.yml` — native
events work there.

**Dependency changes are not picked up.** `node_modules` lives in an anonymous
volume inside the container, not in your working copy. Compose reuses that
volume when it recreates the service, so a plain rebuild leaves the old
dependency tree mounted over the new one. Renew it with `-V`:

```bash
docker compose up --build -V
```

**nginx serves an empty response on the prod profile.** A stale build layer.
Rebuild it without cache: `docker compose --profile prod build --no-cache frontend-prod`.

## A note on reproducibility

`frontend/package-lock.json` is currently gitignored, so a fresh clone has no
lockfile and the image installs with `npm install` rather than `npm ci`. Builds
therefore resolve dependencies at build time and are not byte-for-byte
reproducible. Committing the lockfile would fix that, but it is a change with
its own trade-offs and belongs in its own pull request.
