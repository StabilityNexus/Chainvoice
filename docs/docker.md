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

> **Why this is a separate command.** Compose cannot build from a remote git
> context: it resolves `build.context` against the project directory before the
> builder ever sees it, so the URL is treated as a local path and the build
> fails. `buildx` has no such limitation. ThruBox does not publish an image yet
> either — the `dockers` block in its `.goreleaser.yaml` is commented out — so
> once it does, this step becomes a plain registry pull.

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
docker compose --profile prod up --build
```

That publishes <http://localhost:8080>. It is the same-origin deployment that
`frontend/.env.example` recommends as the CORS-free option — `VITE_RELAY_URL`
is fixed to the path `/relay`, and nginx forwards it to the relay, so the
browser never makes a cross-origin request. Use it to check a production build
locally, or as a starting point for self-hosting.

Because Vite inlines `VITE_`-prefixed values at build time, the production
image takes them as **build arguments**, not runtime environment. To build with
your own values, pass your env file to Compose:

```bash
docker compose --env-file frontend/.env --profile prod up --build
```

Changing any of them means rebuilding: `docker compose --profile prod build`.

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

**Dependency changes are not picked up.** `node_modules` lives in a volume
inside the container, not in your working copy, so editing `package.json`
needs a rebuild: `docker compose build frontend` (or
`docker compose up --build`).

**nginx serves an empty response on the prod profile.** A stale build layer.
Rebuild it without cache: `docker compose --profile prod build --no-cache frontend-prod`.

## A note on reproducibility

`frontend/package-lock.json` is currently gitignored, so a fresh clone has no
lockfile and the image installs with `npm install` rather than `npm ci`. Builds
therefore resolve dependencies at build time and are not byte-for-byte
reproducible. Committing the lockfile would fix that, but it is a change with
its own trade-offs and belongs in its own pull request.
