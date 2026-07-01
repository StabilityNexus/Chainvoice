# Chainvoice Frontend

This frontend is built with React and Vite.

## Prerequisites

- Node.js 20+
- npm

## Development

1. Install dependencies:
npm install

2. Start local dev server:
npm run dev

3. Build production assets:
npm run build

## Testing

Jest is configured for utility-level unit testing.

- Run tests:
npm test

- Run tests with coverage (CI mode):
npm run test:ci

- Watch mode:
npm run test:watch

## Current Test Scope

- Invoice amount calculations
- Single invoice validation rules
- Batch invoice validation rules
- Negative amount prevention and message consistency
