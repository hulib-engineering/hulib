# HuLib — Agent

Last updated: 2026-06-06

## What is HuLib?

**HuLib** (Human Library) is a Next.js 14 (App Router) web app where "human books" (Huber) offer themselves for scheduled video reading sessions. Users browse stories, book sessions, and have real-time video conversations via Agora.

## Quick Start

```bash
npm install            # uses legacy-peer-deps=true
cp .env .env.local     # fill in real secrets
npm run dev            # starts Next.js (port 3001) + Sentry Spotlight sidecar
```

### Key Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server + Spotlight sidecar |
| `npm run build` | Production build |
| `npm run lint` | ESLint (flat config, Antfu preset) |
| `npm run check:types` | `tsc --noEmit --pretty` |
| `npm run test` | Jest unit tests |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run storybook` | Storybook on port 6006 |
| `npm run check:deps` | Knip dead code analysis |
| `npm run check:i18n` | i18n key coverage check |
| `npm run commit` | Interactive Commitizen commit |
| `npm run build-stats` | Build with bundle analyzer |

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.8 (strict) |
| Styling | Tailwind CSS 3.4 + PostCSS |
| State | Redux Toolkit + React-Redux |
| Auth | NextAuth v4 (Google, Facebook, Credentials) + Firebase Auth (SMS) |
| Validation | Zod + react-hook-form |
| i18n | next-intl (en + vi), synced via Crowdin |
| Real-time | Socket.IO client + Agora RTC SDK |
| Testing | Jest (unit), Playwright (E2E), Storybook test-runner |
| Monitoring | Sentry + Checkly |
| CI/CD | GitHub Actions (lint/typecheck/test/build → semantic-release) |

## Project Structure

```
src/
├── app/[locale]/       # Internationalized route groups
│   ├── (auth)/         # Authenticated routes (home, explore, users, me, admin)
│   ├── (unauth)/       # Public routes (landing, login, register)
│   ├── (special)/      # Special pages
│   └── admin/          # Admin-only routes
├── components/
│   ├── core/           # 28 reusable UI primitives (Button, Input, Dropdown, Modal, etc.)
│   ├── home/           # Landing page components
│   ├── hubers/         # Huber/profile components
│   ├── meeting/        # Video session components
│   ├── messages/       # Chat components
│   ├── stories/        # Story cover, card components
│   └── ...
├── features/           # Feature modules (admin, stories, users)
├── layouts/            # Layout components (admin, booking, profile, etc.)
├── libs/               # Env validation (T3 Env), Firebase, NextAuth, i18n, Redux store, hooks
├── locales/            # en.json (source) + vi.json
├── styles/             # Global CSS, fonts
├── templates/          # Page templates (Base, Main, Admin, Unauth)
├── types/              # Global TS types
├── utils/              # Helpers (AppConfig, dateUtils, etc.)
└── validations/        # Zod schemas (14 files)
```

**Key architectural points:**
- **Backend-agnostic frontend** — all data comes from a separate backend API via `NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT`. This is a pure frontend SPA-like experience.
- **Hybrid auth** — NextAuth (email/OAuth) + Firebase (phone/SMS), managed via `next-auth/jwt` in middleware.
- **i18n-first routing** — all routes under `[locale]` segment (`en`/`vi`).
- **Core primitives** — 28 reusable UI components in `src/components/core/` actively being refactored with Storybook docs.

## Environment Variables

Copy `.env` → `.env.local` and configure. All vars validated at runtime by `src/libs/Env.mjs` (T3 Env + Zod).

**Must-configure:**
- `NEXT_PUBLIC_REACT_APP_BACKEND_ENDPOINT` — backend API URL
- `NEXT_PUBLIC_REACT_APP_BACKEND_SOCKET_ENDPOINT` — Socket.IO endpoint
- `NEXTAUTH_SECRET` — NextAuth encryption secret
- `NEXT_PUBLIC_AGORA_APP_ID` — Agora video SDK
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + `UPLOAD_PRESET` — Cloudinary media
- `GOOGLE_ID` / `GOOGLE_SECRET` — Google OAuth
- `FACEBOOK_ID` / `FACEBOOK_SECRET` — Facebook OAuth
- `CLIENT_EMAIL` / `CLIENT_ID` / `PRIVATE_KEY` / `SPREADSHEET_ID` — Google Sheets API
- Firebase vars (`NEXT_PUBLIC_FIREBASE_*`)

## Current State of Tests

| Type | Status | Notes |
|------|--------|-------|
| Unit (Jest) | Minimal (1 test file: `BaseTemplate.test.tsx`) | Marked "pending" in README |
| E2E (Playwright) | 3 test files, commented out in CI | Needs browser install + CI uncomment |
| Storybook tests | Configured, runs in CI | 9 story files present |
| Coverage | Collected but threshold at 0% | Not enforced |

## CI/CD Pipeline (`.github/workflows/CI.yml`)

1. Build (Node 20 + 22 matrix, caching) — runs on push/PR to `main` or `develop`
2. Test (Node 22): commitlint → lint → typecheck → jest + coverage → Playwright install → Storybook tests
3. On merge to `main`: semantic-release (auto-changelog, version bump, GitHub release)

**Other workflows:** Crowdin i18n sync, Checkly monitoring, monthly dependency update PR via Dependabot.

## Linting & Formatting

- **ESLint** (flat config via `@antfu/eslint-config`) — handles both linting and formatting for JS/TS/TSX
- **Prettier** — only for JSON/YAML in VS Code
- **Husky** — pre-commit (lint-staged: eslint + tsc) + commit-msg (commitlint: conventional commits)
- **Commit convention:** `fix:`, `feat:`, `chore:`, `refactor:`, `build:`, etc.

## Recent Development Focus (Last 30 Commits)

The team has been focused on:

1. **Refactoring core UI components** — Button, IconButton, Checkbox, Dropdown, SocialButton — extracting them into `src/components/core/` with Storybook documentation
2. **Reorganizing repo structure** — moving landing/auth components from `layouts/` to app route groups, cleaning up assets folder
3. **Chat/messaging features** — optimistic send, viewport-based read receipts, real-time receive, full-page layout, mark-as-read fix
4. **Story cover feature** — browser-based cover composition with rasterize-to-PNG flow (see `docs/story-cover-handoff.md`)
5. **Responsive/mobile fixes** — explore stories page, story detail page
6. **Storybook integration** — fixing env var injection for Storybook browser bundle

## Known Gaps & Things to Be Aware Of

- **Story cover edit does not hydrate UI** — opening edit always shows default preset, not the saved cover state
- **Limited unit test coverage** — only 1 test file exists
- **E2E tests commented out in CI** — need to be re-enabled
- **TypeScript errors are ignored at build time** (`ignoreBuildErrors: true` in next.config.mjs) — fix these for production safety
- **`npm run check:types`** — runs in CI, there may be type errors to resolve
- **Firebase env vars** are listed in `.env` template but not validated in `Env.mjs` — may cause runtime issues
- **Storybook** needs `NEXT_PUBLIC_*` env vars mocked via webpack DefinePlugin (see recent fix commits)
- **Some locale keys are mark as unused** — e.g. `cover_font_size` in en/vi

## Key Files to Know

| File | Why |
|------|-----|
| `src/middleware.ts` | Combined next-intl + NextAuth auth guard (Edge Runtime) |
| `src/libs/Env.mjs` | All env vars validated with Zod here |
| `next.config.mjs` | Sentry, bundle analyzer, image domains, webpack externals |
| `eslint.config.mjs` | ESLint flat config (Antfu preset) |
| `tailwind.config.ts` | Extensive custom theme, animations, screens |
| `src/libs/store/` | Redux Toolkit slices: auth, messenger, minigame, stories, uiState |
| `src/libs/NextAuthOption.ts` | NextAuth provider configuration |
| `src/libs/Firebase.ts` | Firebase client init |
| `src/components/core/` | 28 reusable UI primitives — the component library being built |
| `src/features/stories/` | Story cover feature module (types, utils, components) |
| `docs/story-cover-handoff.md` | Detailed handoff doc for the story cover feature |

## Node.js & Tooling Requirements

- **Node:** 18+ (local), 20/22 (CI), 20 (Netlify)
- **npm** (not yarn/pnpm) — `legacy-peer-deps=true` in `.npmrc`
- **Playwright** — `npx playwright install` for E2E tests
- **Spotlight** — Sentry sidecar for local error monitoring (`spotlight-sidecar`)

## Deployment

Supports **Netlify** (config in `netlify.toml`) and **Vercel** (`.vercel/` dir). Both configs are present.
