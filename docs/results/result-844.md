Result: Huber My Feedback list with endpoint integration and pagination

What changed
src/features/users/components/profile/MyFeedbackPanel.tsx: replaced the commented mock hook with `useGetUserFeedbackQuery` (10 items/page), rebuilt rows to the design (48px avatar, name, 5 hearts, localized date, content, divider), and added centered core pagination with loading/fetching/empty states.
docs/plans/plan-844.md: plan for issue #844.

Gates
- npm run lint: pass (0 errors; 101 pre-existing warnings across the repo)
- npm run check:types: pass (first run hit stale `.next/types` for a removed users layout; cleared `.next` and re-ran once — clean)
- npm run check:i18n: not applicable — no locale keys added or changed
- npm run test: pass (10 suites, 62 tests)
- test-storybook:ci: not run locally — CI only (see .ai/skills/implement-plan.md)

Needs manual UI check
- `/en/users/<huber-id>` and `/vi/users/<huber-id>` → "My Feedback" tab (own profile, Huber account): confirm the list renders reader ratings with a 48px round avatar (generated fallback when photo is missing), name, 5 hearts (pink filled / gray empty), locale-formatted date ("July 24, 2024" / vi format), and full review text.
- Confirm pagination shows only when there is more than one page, 10 rows per page, prev/next disable at the ends, and the list dims while a page is fetching.
- Confirm mobile/tablet layout: header row stays horizontal, date wraps, pagination stays usable.

What was done

Wired the Huber "My Feedback" tab to the existing `GET users/{userId}/feedbacks` endpoint through `useGetUserFeedbackQuery`, rendering the response `data` with `meta.currentPage`/`totalPages`. Rows were restyled to match the reference design and the core `Pagination` component was added with a 10-item page size. The mock query block was removed; loading shows `StoriesSkeleton`, an empty result shows the existing heart empty state, and page changes dim the list while fetching.

Notes / follow-up
- BE is assumed complete per the #844 contract; if any answer differs (page base, sort order, null photo, empty `totalPages`), adjust only `src/libs/services/modules/user/getUserFeedback.ts`.
- Shared `FEEDBACK_PAGE_LIMIT = 5` is untouched; this panel passes `limit: 10`.
- Page state is local, so switching tabs and returning resets to page 1.
- Visual verification (spacing, colors, breakpoints) was done by code review only; a developer must confirm in a browser.
