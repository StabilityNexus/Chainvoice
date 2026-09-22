# syntax=docker/dockerfile:1

# Node 24 LTS, pinned to an exact patch rather than a floating tag so installs,
# builds and lint results are identical for everyone and do not shift under us
# when the tag moves. frontend/README.md asks for Node 18 or newer; 20 reached
# end of life in April 2026, so this tracks the current LTS line instead.
FROM node:24.21.0-alpine AS deps
WORKDIR /app

# package-lock.json is gitignored in this repository, so a fresh clone has no
# lockfile and `npm ci` would fail outright. The glob picks one up when it does
# exist — a working copy that has run `npm install`, for instance — without
# breaking the build when it does not.
COPY package.json package-lock.json* ./
RUN npm install

# ---------------------------------------------------------------------------
# dev — Vite dev server with hot reload, source bind-mounted by compose
# ---------------------------------------------------------------------------
FROM deps AS dev
ENV NODE_ENV=development
EXPOSE 5173
# Vite binds to localhost by default, which inside a container means the
# container's own loopback — the published port would reach nothing. --host
# puts it on 0.0.0.0 so the mapping works.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------------------------------------------------------------------------
# build — production bundle
# ---------------------------------------------------------------------------
FROM deps AS build
COPY . .

# Vite inlines every VITE_-prefixed variable into the bundle at build time, so
# these have to be present now; setting them when the container starts would be
# too late. Vite reads them from process.env as well as from .env files, and
# process.env wins, so ENV here overrides anything in a copied .env.
#
# Defaults mirror frontend/.env.example. VITE_RELAY_URL defaults to the path
# form on purpose: nginx below proxies /relay, keeping the browser same-origin
# so the relay's missing CORS headers never matter.
ARG VITE_RELAY_URL=/relay
ARG VITE_RELAY_API_KEY=
ARG VITE_RELAY_TIMEOUT_MS=
ARG VITE_WALLETCONNECT_PROJECT_ID=
ARG VITE_CONTRACT_ADDRESS_11155111=0x65eb0ca96f972c5a0cdaa623a5b54650e499df5b
ARG VITE_CONTRACT_ADDRESS_61=
ARG VITE_CONTRACT_ADDRESS_137=

ENV VITE_RELAY_URL=$VITE_RELAY_URL \
    VITE_RELAY_API_KEY=$VITE_RELAY_API_KEY \
    VITE_RELAY_TIMEOUT_MS=$VITE_RELAY_TIMEOUT_MS \
    VITE_WALLETCONNECT_PROJECT_ID=$VITE_WALLETCONNECT_PROJECT_ID \
    VITE_CONTRACT_ADDRESS_11155111=$VITE_CONTRACT_ADDRESS_11155111 \
    VITE_CONTRACT_ADDRESS_61=$VITE_CONTRACT_ADDRESS_61 \
    VITE_CONTRACT_ADDRESS_137=$VITE_CONTRACT_ADDRESS_137

RUN npm run build

# ---------------------------------------------------------------------------
# prod — static bundle behind nginx, which also proxies /relay
# ---------------------------------------------------------------------------
FROM nginx:alpine AS prod
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
