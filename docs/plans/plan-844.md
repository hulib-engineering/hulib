# Plan: Huber My Feedback list with endpoint integration and pagination

Issue: #844
Branch: feat/844-huber-my-feedback-pagination

## Sub-tasks

| # | Sub-task | Done condition |
| ----- | -------- | -------------- |
| 1 | Wire the real feedback API: replace the mock hook in `src/features/users/components/profile/MyFeedbackPanel.tsx` with `useGetUserFeedbackQuery({ userId: huberId, page, limit: 10 }, { skip: !huberId })`; keep local 1-based page state and the `StoriesSkeleton` loading + `Common.feedback_empty` empty states. | Panel fetches page 1 with 10 items; loading and empty states still render; no mock hook remains. |
| 2 | Rebuild the feedback row per design: `Avatar size="lg"` (48px, generated fallback when `feedbackBy.photo` missing), name `text-xl font-medium`, five 16px hearts (`text-pink-50` filled / `text-neutral-70` empty), locale-formatted `createdAt` (`en-GB` / `vi-VN`, `text-sm` gray), content `text-sm` below, `border-b` divider and ~24px vertical spacing. | Rows match the written spec and screenshot — **needs manual browser check** (avatar 48px, name ~20px, hearts 16px, divider 1px, spacing 24px). |
| 3 | Add pagination: reuse `src/components/core/pagination/Pagination` centered under the list with 10 items/page; convert API 1-based `meta.currentPage` to the component's 0-based `currentPage` (pattern from `MeetingCardGrid.tsx`); hide when `totalPages <= 1`; reset to page 1 when the tab re-opens. | Clicking a page refetches the correct page; prev/next disable at the ends; pagination hidden for one page — **needs manual browser check**. |
| 4 | Responsive + fetch states: keep the header row horizontal on mobile, let the date wrap, dim the list and disable controls while `isFetching`, and honor the `tailwind.config.ts` `screens` breakpoints (`sm` / `md` / `lg` / `xl`). | Layout holds at mobile/tablet/desktop widths — **needs manual browser check**. |
| 5 | Verification: run `npm run lint`, `npm run check:types`, `npm run check:i18n`, `npm run test` once at the end; write `docs/results/result-844.md`. | All gates pass (Storybook `test-storybook:ci` is CI-only and must not run locally). |

## Decisions / risks

- BE is assumed already implemented per the contract in issue #844 (`GET users/{userId}/feedbacks?page&limit`). If the response differs, adapt the types in `src/libs/services/modules/user/getUserFeedback.ts` only.
- Shared `FEEDBACK_PAGE_LIMIT = 5` stays untouched; the panel passes `limit: 10` explicitly.
- The core `Pagination` expects a 0-based `currentPage`, while the API `meta.currentPage` is 1-based — conversion is required.
- `Avatar` uses `react-nice-avatar` as a fallback, so no `next/image` remote-domain change is needed.
- Visual spacing/colors come from the written spec and the chat screenshot only; the developer confirms pixels in a browser. The AI does not run the dev server or capture screenshots.
