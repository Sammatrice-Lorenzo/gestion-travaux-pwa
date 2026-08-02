# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Gestion Travaux is a Framework7 PWA (single-view, Vite-bundled) for managing a tradesperson's clients, work
orders ("prestations"), calendar events, product invoices and supplier returns. It talks to a separate
backend API (not in this repo) over `/api`, uses Firebase Cloud Messaging for push notifications, and
ships as an installable offline-capable PWA (Workbox service worker).

## Commands

Package manager is **yarn** (yarn.lock is authoritative; a stray `package-lock`/npm usage should be avoided).

- `yarn dev` / `yarn start` — dev server (Vite, NODE_ENV=development), served at `http://localhost:5173`, proxies `/api` to `API_URL` from `.env.local`.
- `yarn build` — runs `inject-firebase-env.js` (prebuild), production Vite build to `www/`, then generates the Workbox service worker (`workbox generateSW workbox-config.js`).
- `yarn start prod` — runs the app with `NODE_ENV=production` without building (`vite` in prod mode).
- `yarn test-server` — starts the app with `NODE_ENV=test` (reads `.env.test.local`); this is the server Playwright boots for e2e runs.
- `yarn test:e2e` — runs the full Playwright suite (`playwright.config.ts`, tests in `tests/`). Playwright auto-starts `test-server` unless one is already running.
  - Single file: `yarn test:e2e tests/client.spec.ts`
  - Single test by name: `yarn test:e2e -g "Create client"`
  - The `setup` project (`tests/auth.setup.ts`) runs first and writes `tests/auth.json`, which other projects reuse as `storageState` — don't delete/ignore it when debugging auth-dependent tests.
- Lint/format: `npx biome check --write .` (Biome is the source of truth; see `biome.json`). `eslint.config.mjs` also exists but only targets `**/src/js/*.js` — Biome is what CI and the pre-commit hook actually run.
- Pre-commit: Husky + lint-staged run `biome check --write --no-errors-on-unmatched` on staged `.ts/.js/.css/.json/.md/.yml/.f7` files automatically — don't bypass with `--no-verify`.
- CI (`.github/workflows/quality.yml`) runs Biome (via reviewdog) only on changed files on PRs/push to `dev`. `.github/workflows/playwright.yml` runs the e2e suite.
- **There is no `tsconfig.json`** — `.ts` files are transpiled by Vite/esbuild but never type-checked in CI or locally. Don't rely on `tsc` for verification; correctness has to come from careful typing, Biome, and the Playwright suite.

## Architecture

### Framework7 single-file components (`.f7`)

Pages and reusable UI live in Framework7's single-file component format: a `<template>` (uses Framework7's
`$h` tagged-template / lit-html-like syntax and `${...}` bindings) followed by a `<script>` exporting a
component factory `(props, { $, $on, $f7, $onMounted, $update, $render }) => {...}`.

- Pages: `src/pages/<domain>/*.f7`, routed centrally in `src/js/routes.js` (imported into the Framework7
  instance created in `src/js/app.js`, which also bootstraps push notifications, the service worker, and
  session restore before rendering).
- The `<script>` block is intentionally thin: it wires DOM events, calls into `src/js/service/**` for
  business logic, reads/writes `src/js/store/**` (Framework7 `createStore`) for shared state, and calls
  `$update()`/returns `$render` to re-render. Keep new page logic out of the template and out of ad-hoc
  DOM queries where a store or service already exists for that concern.
- Popups/sheets/modals built dynamically from TS (e.g. `src/js/components/popupSupplierReturn.ts`,
  `src/js/components/modalUploadFiles.ts`) follow the same shape: a `createPopup`/`createSheet` function
  building an `$f7.popup.create(...)`/sheet with a template string, wiring `on: { open: ... }` to fill form
  data and bind button handlers, returning the F7 instance to the caller.

### Domain-oriented `src/js` structure

- `src/js/service/<domain>/` — one class or set of functions per concern (e.g. `SupplierReturnFormService`,
  `SupplierReturnFileManagement`, `SupplierReturnToolbarService`). Prefer this granularity for new features:
  split "load/toolbar state", "form fill/submit", "file upload/download" into separate services rather than
  one large service per domain, mirroring `supplierReturns/` and `productInvoices/`.
- `src/js/service/schema/<domain>/` — Zod schemas used to validate forms/API payloads before submission.
- `src/js/service/api/ApiService.ts` and `ApiMutationService.ts` — the only place that should call `fetch`
  against the backend; they handle the Hydra (`hydra:member`/`hydra:totalItems`) response envelope, 401
  handling (clear session + force logout dialog), and response caching (`cache.ts`) in production. New
  domain services should call through these, not `fetch` directly.
- `src/js/store/*.ts` — Framework7 `createStore` instances, one per domain-level shared collection
  (e.g. `supplierReturnInvoiceStore`, `productInvoiceStore`), each with typed `state`/`getters`/`actions`.
  Components read via `store.getters.xxx.value` and mutate via `store.dispatch('actionName', payload)`.
- `src/intefaces/<Domain>/*.ts` (note: existing spelling `intefaces`, not `interfaces` — match it for
  consistency, don't silently "fix" it) — TypeScript interfaces for domain entities and forms, imported with
  `import type`. Add new domain types here rather than inlining object shapes in services.
- `src/js/formatter/` — pure functions turning domain data into sheet/modal-ready view models.
- `src/js/helper/` — small stateless utilities (dates, phone numbers, status labels).
- `src/js/components/` — flat, cross-domain UI building blocks (popups, sheets, toasts, tabbar, PDF preview).
  Domain-specific reusable UI instead lives next to its domain (see `src/js/work/component/` for
  work-specific components) — follow that precedent for new domain-scoped UI rather than dropping everything
  into the flat `components/` folder.

### Conventions for new code

- New source files should be TypeScript (`.ts`), even though the project is mid-migration from `.js` and
  both coexist. Match the class/service pattern already used in the target domain folder rather than
  introducing a new style.
- Favor small, single-responsibility services/classes over growing an existing one (SRP): a service that
  fetches, one that formats, one that manages toolbar/date state — see `supplierReturns/` as the reference
  layout for a full CRUD+file-upload feature (form service, file management, toolbar service, store, popup,
  formatter, schema, interfaces).
- Depend on abstractions already in place instead of reaching around them: go through `ApiService`/
  `ApiMutationService` for network calls, through the domain `store` for shared state, through
  `service/schema/**` (Zod) for validation — don't duplicate fetch/validation logic inline in a page script.
- `console.log` is a Biome lint error (`suspicious.noConsoleLog`); use `console.error`/`console.warn` or
  remove debug logging before committing.
- Path alias `@` resolves to `src/` (see `vite.config.js`); prefer relative imports within a feature folder
  and `@`-rooted imports for cross-cutting modules if introducing new deep import paths.
