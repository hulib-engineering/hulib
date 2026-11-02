Result: feat: add floating next-meeting alert widget

What changed
src/locales/en.json, src/locales/vi.json: added the `MeetingAlert` namespace (title, now, time_left, time_left_minutes, go_to, show_alert, collapse, expand).
src/libs/services/modules/reading-session/getUpcomingReadingSessions.ts: added the upcoming-sessions query, DTO types and the `USE_UPCOMING_ENDPOINT` switch.
src/libs/services/modules/reading-session/index.ts: registered the endpoint and exported the new types/flag.
src/features/meeting-alert/utils/upcoming.ts: temporary fallback that derives the 24h window from `GET /reading-sessions` while the dedicated endpoint is unavailable.
src/features/meeting-alert/utils/countdown.ts, countdown.test.ts: countdown/state helper with unit coverage.
src/features/meeting-alert/types.ts: `MeetingAlertItem` / `UseMeetingAlertResult`.
src/features/meeting-alert/hooks/useMeetingAlert.ts: polling (60s), focus refetch, 30s clock tick, server-time skew and collapse state persisted per user; no route gating, so the widget is available everywhere.
src/features/meeting-alert/components/MeetingAlertRow.tsx, MeetingAlertFull.tsx, MeetingAlertMini.tsx: meeting card (avatar + verified tick, time pill or "Đến buổi gặp gỡ" CTA), 352px full card with the minus collapse button, and collapsed pill.
src/features/meeting-alert/components/*.stories.tsx: Storybook stories for the full card and mini pill.
src/features/meeting-alert/components/MeetingAlertWidget.tsx, index.ts: container (full/mini switch, profile link) and barrel.
src/features/users/components/profile/HuberSchedulePanel.tsx: `?section=meeting` now opens the meeting list for the profile owner and stays in sync with the URL.
src/templates/MainTemplate.tsx: mounted the widget globally.

Gates
- npm run lint: pass (0 errors, 105 pre-existing warnings)
- npm run check:types: pass
- npm run check:i18n: pass (tool exits 0; reports one pre-existing undefined key, `notifications.time_left` in src/components/notification/styles/MeetingDecisionModal.tsx, also present on develop and unrelated to #838)
- npm run test: pass (9 suites, 56 tests)
- npm run test-storybook:ci: not run locally — CI only (see .ai/skills/implement-plan.md)

Needs manual UI check
- Any authenticated page: the 352px full card appears at the top-right within 24h of an approved session; verify the 4px `#84ACFC` border, 12px radius, shadow, 20px title and the header divider against the design.
- Meeting cards: avatar + verified tick, name, and either the gradient "Now" pill with the "Đến buổi gặp gỡ" CTA or the solid-blue "4h 5m" pill.
- Minus (`–`): collapses to the 132x52 pill; `+` restores the card.
- With more than two sessions, the double-chevron at the bottom of the second card expands all sessions in the 24h window and rotates up to collapse.
- Clicking a card or the CTA with `tab=schedule&section=meeting`: lands on the owner's profile schedule with the Meeting tab selected.
- The widget is now visible on every page, including `/reading`, `/messages` and `/register-huber/create-book`.
- AI did not capture screenshots; visual verification is pending in a browser.

What was done

Added a global floating alert that lists approved reading sessions starting within the next 24 hours on every authenticated page. The full card shows the first two sessions — ongoing ones get the "Đến buổi gặp gỡ" CTA, future ones show the time left — and a double-chevron expands the rest of the 24h list. The header only has the minus control (the count badge was removed per the updated design) and the card can be collapsed into a small countdown pill. Only the collapse state is persisted; there is no dismiss action. The widget remains display-only: every action navigates to `/users/{userId}?tab=schedule&section=meeting`, which required adding `section` query-param support to the profile schedule panel.

Notes / follow-up
- The backend endpoint `GET /reading-sessions/upcoming?withinHours=24&limit=10` does not exist yet. `USE_UPCOMING_ENDPOINT` is `false`, so the hook derives the list client-side from `GET /reading-sessions`; flip the flag (and delete `utils/upcoming.ts` if no longer needed) once the endpoint ships.
- Out of scope: `GET /reading-sessions` ignores the `upcoming: true` flag, so the profile "Upcoming event" view still relies on ordering; worth a separate issue.
- The pre-existing `check:i18n` undefined key is a static-analysis false positive caused by passing `t` into a helper; it does not come from this task.
