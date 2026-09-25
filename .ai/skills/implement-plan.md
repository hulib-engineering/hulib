# Skill: implement-plan

Trigger keyword: `implement`
Args: plan=docs/plans/plan-<issue>.md

This is step 2 of the FE AI flow. Runs after `plan` (step 1) wrote `docs/plans/plan-<issue>.md` and created the branch.

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 verify-ui (optional) → 4 create-pr

## Steps

1. Read the plan file and the design references at `.ai/references/<issue>/`. Read each image before writing UI code.
2. Make sure the app can serve locally. If no dev server is running, start `npm run dev` (Next.js, port 3001). Playwright is configured with `reuseExistingServer`, so keep one instance alive across the session.
3. Implement sub-task by sub-task, in order. One commit per sub-task only; message per the commit convention `fix:` / `feat:` / `refactor:` / `chore:` etc., always carrying the issue reference (`#<issue>`), e.g. `feat: add cover preview (#412)`. Never bundle multiple sub-tasks into one commit and never use `--no-verify`.
4. For every sub-task that changes UI:
   a. Capture a full-page screenshot of the target route (with the relevant locale) using Playwright — the `playwright` MCP server configured in `.mcp.json`, or a throwaway `@playwright/test` script (delete the script after capture, keep the PNG). Locales default half: `/explore-story` = en, `/vi/explore-story` = vi.
   b. Save the PNG to `.ai/references/<issue>/verify-<NN>.png`, compare it with the design reference, and iterate until spacing, colors, typography, and text match.
   c. Auth guard: `src/middleware.ts` redirects unauthenticated requests to `/auth/login`. For authed routes with no public equivalent, either screenshot a public route (public routes: `/`, `/about`, `/explore-story`, `/auth/*`, `/admin/auth/login`) or a Storybook story (`npm run storybook`, port 6006). If none works, do a code-level check and record a "needs manual UI check" note in the result doc — never fake a screenshot.
5. Per sub-task verification: `npm run check:types` and `npm run lint`.
6. Before finishing, run the full gates:
   - `npm run lint`
   - `npm run check:types`
   - `npm run check:i18n` (if locale keys changed)
   - `npm run test` (if logic or tests changed)
   - `npm run test-storybook:ci` (if a Storybook story was added/changed and browsers are installed)
   Fix anything that fails in a follow-up commit.
7. Write `docs/results/result-<issue>.md` (format below, NOT directly under `docs/`).
8. Tell the user: implementation done, result saved at `docs/results/result-<issue>.md`.

## Output format (docs/results/result-<issue>.md)

```
Result: <issue title>

What changed
<file>: <short description>
<file>: <short description>

Visual verification
- reference: .ai/references/<issue>/design-01.png
- implemented: .ai/references/<issue>/verify-01.png

What was done

<short summary, plain language>

Notes / follow-up
<anything left, anything to check manually>
```
