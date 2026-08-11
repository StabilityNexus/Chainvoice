# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project Overview

Chainvoice is a decentralized invoicing platform: a Solidity smart contract backend (deployed on Ethereum Classic) paired with a React/Vite frontend. See `README.md` for the full architecture and user-facing feature set.

## Repository Layout

- `contracts/` — Foundry project (Solidity smart contracts, tests, deploy scripts)
- `frontend/` — React + TypeScript + Vite app (Tailwind CSS, shadcn/ui components)
- `docs/` — static assets referenced by documentation
- `brand/` — logo, favicons, and brand guidelines (see `brand/Brand.md`)

## Build, Test & Lint

Frontend (run from `frontend/`):
```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run lint     # ESLint
npm run test     # Jest unit tests
npm run test:ci  # Jest with coverage, CI mode
```

Smart contracts (run from `contracts/`, requires [Foundry](https://getfoundry.sh/)):
```bash
forge build
forge test
forge test -vvv   # verbose trace output for failures
```

## Contract Change Rules

Any change to smart contract logic must follow `CONTRIBUTING.md`'s Smart Contract Contribution Guidelines:
- New/changed contract logic requires comprehensive automated tests (including revert/failure cases).
- Major features or architectural changes need an approved design issue before implementation.
- Keep PRs scoped to a single feature/fix/bug.
- All CI checks (build, lint, tests) and CodeRabbit review comments must be resolved before requesting a mentor review.

## Conventions

- Frontend styling uses Tailwind utility classes bound to the semantic HSL tokens in `frontend/src/index.css` (`bg-background`, `text-primary`, etc.) — don't hardcode hex colors; see `brand/Brand.md` for the palette.
- Fonts are Inter (body) and Montserrat (headings), registered in `frontend/tailwind.config.js`.
