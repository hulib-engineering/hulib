# Skill: verify-ui

Trigger keyword: `verify` / `verify-ui` / `screenshot`
Args: issue=<number> [route=<path>] [locale=en|vi]

Optional guard between implement and pr. Use it whenever the user wants visual proof that the UI matches the design reference.

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 verify-ui (optional) → 4 create-pr

## Steps

1. Read the design references at `.ai/references/<issue>/`.
2. Serve the app: reuse a running `npm run dev` (port 3001) or start one.
3. Choose the target URL. Default to the route the issue touches with locale prefix (e.g. `/explore-story`, `/vi/stories/<id>`). If the route requires auth, use a public route (`/`, `/about`, `/explore-story`, `/auth/*`) or a Storybook story (port 6006); otherwise ask the user for an authenticated page URL before continuing.
4. Capture full-page screenshots at desktop 1280px and mobile 375px widths, save to `.ai/references/<issue>/verify-<NN>.png`.
5. Compare each capture with the design reference and report concrete mismatches:
   - layout / spacing (gap, padding, alignment)
   - color tokens
   - typography (size, weight, line-height)
   - visible text (missing/wrong i18n key)
   - overflow / broken layout at a breakpoint
6. If mismatches are found, fix the code and re-capture until it matches, or write the remaining items as follow-up notes. Never silently close.
7. Output the list of capture paths and the match result to the user.
