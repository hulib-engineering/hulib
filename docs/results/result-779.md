Result: feat: booking schedule card grid on profile schedule tab (Liber + Huber)

What changed

- `src/libs/services/modules/reading-session/getReadingSessions.ts`: sends `offset` instead of the dead `page` param, passes through `sessionStatuses`, and adds a `paramsSerializer` so arrays arrive as repeated keys (the backend validates `@IsArray() @IsEnum(each)`, which a comma-joined value fails).
- `src/libs/services/modules/reading-session/createNewReadingSession.ts`: adds `huberJoinedAt` / `readerJoinedAt` and a `role` field on the nested user, both of which the backend already returned but the type omitted.
- `src/layouts/scheduling/BigCalendar.tsx`, `MobileSessionList.tsx`, `SessionDetailCard.tsx`: replaced every `=== StatusEnum.Pending` / `=== StatusEnum.Approved` with the existing case-insensitive `isPendingSessionStatus()` / `isApprovedSessionStatus()`. Also fixed the calendar's status filter, which compared a `StatusEnum` value against the wire casing and so never matched.
- `src/features/users/components/profile/*` (31 files, moved from `src/_components/profile/`) and `src/features/users/components/stories/*` (6 files, moved from `src/app/[locale]/(auth)/users/[id]/_components/`). `src/_components/` is deleted. `UserProfileClient.tsx` stays as the route's client entry. Imports updated in `StorySidePanel`, `MyBook`, and the admin users page.
- `src/features/users/constants/profile.contant.ts`: adds the `schedule` tab to `LIBER_OWN_TABS`.
- `src/features/users/features/schedule/` (new module): `types.ts`, `utils/variant.ts`, `utils/filters.ts`, `hooks/useScheduleMeetings.ts`, `components/MeetingCard.tsx`, `MeetingCardGrid.tsx`, `ScheduleHeader.tsx`, `ScheduleEmptyState.tsx`, plus `MeetingCard.stories.tsx` and unit tests for both utils.
- `src/features/users/components/profile/HuberSchedulePanel.tsx`: the `meeting` sub-tab now renders the grid instead of a hardcoded empty state; a Liber skips the sub-tab bar entirely.
- `src/components/notification/styles/MeetingDecisionModal.tsx`: prop types widened so it accepts a `ReadingSession` as well as a notification payload.
- `src/locales/en.json`, `src/locales/vi.json`: new `Schedule.meeting_list` namespace.
- `tailwind.config.ts`: added the missing `lavender.98` stop.
- Playwright removal (separate concern, same branch): deleted `playwright.config.ts` and the local e2e specs, removed `@playwright/test`, `@percy/playwright`, `@percy/cli` and `eslint-plugin-playwright` from `package.json`, dropped the `test:e2e` script and the eslint plugin block, excluded `tests/` from `tsconfig.json`, and updated README / AGENTS.md / CLAUDE.md and the two deploy workflows.
- `.gitignore`: ignores `.opencode/`, `.playwright-mcp/`, `.playwright-simulate/`, `.serena/`.

Gates

- `npm run lint`: pass (exit 0, 100 pre-existing warnings). This failed with 3249 errors before the gitignore work, because ESLint was walking untracked tool directories.
- `npm run check:types`: pass.
- `npm run check:i18n`: no new failures; zero `meeting_list` keys unused. The command still exits non-zero on failures that predate this branch and are identical on `develop` (`MeetingDecisionModal` -> `time_left`, plus unused/invalid keys).
- `npm run test`: 24/24 pass (23 new).
- `npm run test-storybook:ci`: not run locally — CI only (see `.ai/skills/implement-plan.md`).

Needs manual UI check

- `/users/{ownId}?tab=schedule` as a **Liber**: confirm the grid renders with no "Personal time" sub-tab, and that `invitation` never appears.
- `/users/{ownId}?tab=schedule` as a **Huber**: switch to the "Meeting schedule" sub-tab and confirm the grid, the pending count pill, and the "View" filter.
- Card against the Figma spec: 304px wide, 4px `primary-70` border and 8.8px `primary-60` glow on `right_now`; **no** border on `done` / `missed`; 4px-radius time block; 20px blue verified tick left of the name (orange "Liber" chip when the counterpart is a Liber); 32px Join button with no border.
- Responsive: 1 / 2 / 3 columns at base / `md` / `xl`, and whether cards in a row align in height under long story titles.
- Accept / Reject / Delete end to end against a real session — the modals were wired but never exercised in a browser.

What was done

The schedule tab on a profile now lists every booking the viewer participates in as a card grid. One `GET /reading-sessions` covers both roles: the backend already scopes the list to sessions where the caller is either the human book or the reader, so a Liber and a Huber get the same payload and differ only in how each pending session is labelled. The pure `resolveVariant` function owns that decision — `approved` splits into `right_now` / `upcoming` on the clock, `pending` splits on which side of the booking the viewer sits. Cards, the count pill, and the filter all read from that single source.

A live bug was fixed along the way: `StatusEnum.Pending` is `'Pending'` but the backend sends `'pending'`, so every pending comparison in the existing `/my-schedule` code was silently false and pending cards rendered as approved.

Notes / follow-up

- **The design was implemented from the Figma spec, never opened in a browser.** Card metrics come from the spec text above; the coloured classes already existed unused in `profile.contant.ts` and were reused unchanged.
- **Two non-existent Tailwind classes were found.** `CARD_CLASS.my_request` referenced `bg-lavender-98`, which was not in the theme and resolved to nothing; the missing `98` stop was added. `bg-primary-95`, used by the existing viewer empty state in `HuberSchedulePanel.tsx`, is still invalid and still renders no background — pre-existing and left alone.
- **`StoryCard` was deliberately not consolidated.** Two different components share that name: one in `src/features/stories/components/` (462 lines, carries a `TODO: unite this file with (landingpage)/.../StoryCard`) and one in the landing page (233 lines). The profile components still import the landing-page one, so the feature is not fully independent of `src/app/`. Merging two divergent components mid-feature risked the landing page; it needs its own issue.
- **`@storybook/test-runner` still pulls Playwright in transitively.** The local e2e suite is gone and `@playwright/test` is no longer a direct dependency, but the Storybook runner declares `playwright` itself and CI still installs browsers for it. Dropping that gate entirely was offered and not taken up.
- **`MeetingDecisionModal` was loosened to `any`.** It is shared with `MeetingRequestNotification` and `NotificationPopover`. A regression there breaks notifications rather than this feature, so it deserves a look in review.
- **`now` is passed into the resolver rather than read inside it.** Nothing re-renders as the clock crosses a session boundary, so a `right_now` card goes stale until the next refetch. Same property as the existing `/my-schedule`. A ticking timer is the fix and is out of scope.
- **No pagination is wired.** The `offset` fix makes the param reachable and sorting is client-side, so a user with more sessions than `limit` silently loses the tail. Pre-existing; infinite scroll is out of scope.
- **`canceled` / `rejected` are unreachable** — they are not in the backend's default status filter, so `resolveVariant`'s `null` branch is defensive only.
