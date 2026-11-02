# Plan: feat: add floating next-meeting alert widget

Issue: #838
Branch: feat/838-floating-meeting-alert

## Sub-tasks

| # | Sub-task | Done condition |
| ----- | -------- | -------------- |
| 1 | Add the `MeetingAlert` namespace to `src/locales/en.json` and `src/locales/vi.json` (`title`, `now`, `time_left` with `{hours}`/`{minutes}`, `go_to`, `dismiss_all`, `show_alert`). | Keys exist in both files and `npm run check:i18n` passes. |
| 2 | Add `src/libs/services/modules/reading-session/getUpcomingReadingSessions.ts` (types: `id`, `sessionStatus`, `startedAt`, `endedAt`, `counterpart {id, fullName, photo, role}`, `meta {count, serverTime, withinHours}`) and register it in `reading-session/index.ts`. While BE is pending, keep a temporary fallback that derives the same shape from `getReadingSessions` (`sessionStatuses: ['approved']`, `startedAt = now - 2h`, `endedAt = now + 24h`, filter `endedAt >= now`, sort ascending). | `npm run check:types` and `npm run lint` pass; the hook can consume one typed shape regardless of source. |
| 3 | Add `src/features/meeting-alert/utils/countdown.ts` + `countdown.test.ts`: ongoing → `now`, `45m`, `4h 5m`, ended, invalid date. | `npm run test` passes; no timezone-dependent assertions (`startedAt` epoch math only). |
| 4 | Add `src/features/meeting-alert/hooks/useMeetingAlert.ts`: query with `pollingInterval: 60_000` + `refetchOnFocus: true`, 30s clock tick, `serverTime` offset, per-user `localStorage` keys (`hulib.meeting-alert.collapsed.v1.<userId>`, `hulib.meeting-alert.dismissed-ids.v1.<userId>` with pruning of ended ids), sort ongoing-first then `startedAt` asc. | `npm run check:types` / `lint` / `test` pass; hook returns `{ items, count, isCollapsed, collapse, expand, dismissAll }`. |
| 5 | Add presentational components `MeetingAlertFull`, `MeetingAlertRow`, `MeetingAlertMini` in `src/features/meeting-alert/components/`, reusing `Avatar`, `Button`/`IconButton`, `mergeClassnames`. Full card: 218×155px shell, 1.5px `primary-60` border, 12px radius, soft shadow, 22px count chip with white ring, 20px avatar, 18px `Now` / `Xh Ym` pills, 10.5px `neutral-30` footer. Mini: 132×52px pill, 3-4px blue gradient border, 32px lavender icon circle, 18px red badge, dark `+`. | Storybook story renders `full`, `mini`, `now`, `many`; `check:types` + `lint` pass — **needs manual browser check** (design is not in the repo). |
| 6 | Add `MeetingAlertWidget` container: full ⇄ mini switch, rows + CTA navigate to `/users/{currentUserId}?tab=schedule&section=meeting`, `stopPropagation` on `−` / `+`, `aria-live="polite"` on countdowns, responsive (`<lg` mini anchored above `MobileBottomNav`, `>=lg` full fixed right 18px / top 56px). | Typecheck + Storybook render; **needs manual browser check at 375 / 768 / 1280 / 1440**. |
| 7 | Add `section` query-param sync to `OwnerSchedule` in `src/features/users/components/profile/HuberSchedulePanel.tsx`, so `?tab=schedule&section=meeting` opens `MeetingCardGrid` for a Huber owner; keep local state and URL in sync like `useProfileTab`. | Navigating to the widget destination shows the meeting list for both Huber and Liber (Libers already render `MeetingCardGrid`). |
| 8 | Mount the widget in `src/templates/MainTemplate.tsx`; skip `/reading`, `/messages`, `/register-huber/create-book`; admin never mounts it. Run all gates: `npm run lint`, `npm run check:types`, `npm run check:i18n`, `npm run test`. | All four gates pass; widget appears on authenticated pages and is absent on the excluded routes — **needs manual browser check**. |

## Decisions / risks

- **BE dependency (blocking for the final behaviour, not for coding):** `GET /reading-sessions/upcoming?withinHours=24&limit=10` does not exist yet in `hulib-services`. The service is written against it and sub-task 2 keeps a client-side fallback on the existing list endpoint so the widget works in parallel. Remove the fallback once BE lands. The BE response must include `meta.serverTime` and the viewer-relative `counterpart`; no `sessionUrl` / `joinable` is needed.
- **Destination** is the personal profile meeting list (`/users/{id}?tab=schedule&section=meeting`), per the issue. `/my-schedule` is a one-line alternative if the developer prefers the dedicated schedule page.
- **Mini badge** shows minutes until the nearest meeting (the designs show `10` on the mini and `2` on the full chip, so they are different values); cap at 99 and show a live indicator while a session is ongoing. Manual check required.
- **`Tắt cả`** dismisses the current session ids and hides the widget; a new session re-opens it. Dismissed ids are pruned once their `endedAt` passes.
- **Rows** are capped at 2 like the design; when `meta.count > 2`, show a small `+N` link that navigates to the meeting list. Manual check required.
- **Visual verification is not performed by the AI.** No screenshots are captured and no design files are committed; every visual sub-task is flagged for a manual browser check.
- **Polling cost:** the widget polls on every authenticated page. Keep the endpoint lean, `skip` it on excluded routes, and rely on the 60s interval (plus focus refetch) rather than a socket.
- **Clock/timezone:** countdowns use `startedAt`/`endedAt` epoch math (never the local `startTime`/`endTime` clock strings) and are corrected by the `serverTime` offset.
- **Existing bug noted, out of scope:** `useGetReadingSessionsQuery({ upcoming: true })` is ignored by the BE, so `/my-schedule`'s "Upcoming event" reads `data[0]` from a `startedAt desc` list. Fix separately.
- **No e2e locally** (Playwright suites were removed; Checkly runs in cloud) and `test-storybook:ci` is CI-only. Unit tests + Storybook stories are committed.
