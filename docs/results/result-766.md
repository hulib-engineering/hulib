Result: feat: session no-show and auto-cancel notification cards + attendance stamp

Issue: #766
Branch: feat/766-session-no-show-notifications

What changed

- `src/libs/services/modules/reading-session/attendReadingSession.ts`: new RTK Query mutation for `POST /reading-sessions/:id/attend`. No body; inherits the shared `fetchBaseQuery` Bearer header.
- `src/libs/services/modules/reading-session/index.ts`: registered the endpoint and exported `useAttendReadingSessionMutation`.
- `src/layouts/reading/AgoraMeeting.tsx`: fires the attendance stamp immediately after `agoraClient.join(...)` resolves. Wrapped in its own `try/catch` so a failed stamp cannot block or break the call, and no toast is shown. Not keyed on the Agora UID. `sessionId` and the mutation trigger were added to the effect deps to clear a new `exhaustive-deps` warning.
- `src/components/notification/private/types.ts`: added `HUBER_NO_SHOW = 'huberNoShowReadingSession'` and `SESSION_AUTO_CANCELLATION = 'autoCancelReadingSession'`.
- `src/components/notification/private/registry.tsx`: both new types resolve to the shared card.
- `src/components/notification/private/config.tsx`: added an optional `messageKey` field (narrowed to literals so `t.rich` stays type-checked) for cards that render their own copy; converted `SESSION_MISS` to that form and dropped its `title`.
- `src/components/notification/styles/SessionOutcomeNotification.tsx`: new card shared by both new types — single rich-text line, no title, no CTA, no reason box; `disabled-meeting-icon.svg` avatar; creation timestamp footer.
- `src/components/notification/styles/InformativeNotification.tsx`: `SESSION_MISS` renders locale-aware copy with the time range highlighted, the title line is suppressed, the CTA is `fullWidth`, the icon uses `rounded-2xl` instead of `rounded-none`, the background is pinned pink whether read or unread, the icon sits top-left rather than vertically centred, and the reason modal is `MissedReasonModal`.
- `src/utils/dateUtils.ts`: added `formatSessionDateLabel` — "05 tháng 2, 2025" (vi) / "05 February 2025" (en), replacing `toLocaleDateString`'s "05/02/2025"; and `formatSessionDateWithWeekday` — "Wed, 18 February, 2026" (en) / "Thứ 4, 18 tháng 2, 2026" (vi) for the reason modal.
- `src/locales/en.json`, `src/locales/vi.json`: rewrote `session_miss` with `<hl>`; added `huber_no_show_reading_session` and `auto_cancel_reading_session`; removed `session_miss_title` from both.
- `src/components/notification/styles/SessionOutcomeNotification.stories.tsx`: stories for both new types in en and vi, plus a seen/full-width variant.
- `src/app/[locale]/(auth)/my-schedule/[id]/page.tsx`: **new per-session deep link** (scope added after planning). Fetches via `useGetReadingSessionByIdQuery`, renders `SessionDetailCard` with the session's real status, plus a "book this story again" action when the status is `canceled`. Reached by clicking either new card's row, keyed off `relatedEntity.id`.
- `src/components/notification/styles/SessionOutcomeNotification.tsx`: row click now navigates to `/my-schedule/[id]`. `relatedEntity.sessionUrl` is deliberately never used — for these outcomes the room is already finished.
- `src/locales/en.json`, `src/locales/vi.json`: added `Common.loading`, `Common.book_again`, `Common.close`, and a `Schedule.missed_reason` block.
- `src/utils/dateUtils.ts`: added `formatSessionDateLabel` and `formatSessionDateWithWeekday`.
- `src/components/notification/styles/MissedReasonModal.tsx`: **new modal** for capturing the reason on a missed session, replacing `SessionDetailCard` in this one flow. Deliberately a separate component: `SessionDetailCard` is shared with `MobileSessionList` (3 call sites) and `SessionPopover`, which render a different layout, so restyling it for this design would have changed the schedule views too. Submits `note` against the session — the same field and mutation the old shared card used, so existing reasons keep working.
- `src/components/notification/styles/InformativeNotification.tsx`: `SESSION_MISS` copy rewritten, background pinned pink whether read or unread, icon moved to the top-left (`align="start"`), modal swapped.
- `docs/plans/plan-766.md`: the plan, updated with sub-task 6.

Backend contract confirmed after implementation:

- The Huber name is `relatedEntity.humanBook.fullName`, populated by the find-all select (`notifications.service.ts:161-166`). The `sender.fullName` fallback was **removed** — `sender` is the admin account on these notifications and would have printed a system name in the card copy. Same change applied to the `SESSION_MISS` avatar.
- `relatedEntity.reader.fullName` is populated and available for `huberNoShowReadingSession` if product later wants the card to name the reader. Not used by the current copy.
- One missed session sends exactly two notifications: `missReadingSession` to the reader, `huberNoShowReadingSession` to the Huber. The 3-type map is correct.
- `startedAt` is a full ISO DateTime (`2025-02-05T01:00:00.000Z`), parsed before formatting. `startTime` / `endTime` are `@IsString()` with no format validation, so the defensive `formatSessionTime` handling stays.
- `extraNote` is safe to ignore — nothing depends on it exclusively.
- `relatedEntity.rejectReason` is exposed on auto-cancel but not rendered; it is an audit field and the design shows no reason box.

Gates

- `npm run check:types`: pass (exit 0).
- `npm run lint`: fail (exit 1) — **pre-existing**. 3247 errors on `origin/develop` before any of this work; the repo-wide output is byte-identical apart from my files, which are clean. I verified my files individually with `npx eslint` (exit 0).
- `npm run check:i18n`: fail (exit 1) — **pre-existing**. Output is byte-identical to the `origin/develop` baseline (invalid tags and unused keys, all in the ignored `Index` namespace plus one `MeetingDecisionModal` key). None of my new keys are reported. This work actually cleared one pre-existing finding by putting `Common.could_not_find_resource` to use.
- `npm run test`: fail (exit 1) — **pre-existing**. Jest picks up Playwright specs under `.playwright-simulate/tests/` and they fail with "Playwright Test needs to be invoked via 'npx playwright test'". The one real Jest suite (`BaseTemplate.test.tsx`) passes.
- `npm run test-storybook:ci`: **could not run.** The script is `start-server-and-test serve-storybook http://127.0.0.1:6006 test-storybook`, but no `test-storybook` script exists in `package.json`, so the gate cannot pass as written. I ran its two halves separately: `npm run storybook:build` succeeds (exit 0) and compiles `SessionOutcomeNotification-stories` into its iframe bundle; the `test-storybook` browser run was skipped at your instruction (Playwright browsers are not installed locally).
- Commit hooks: sub-task 5 was committed with the real hooks (lint-staged eslint + `check:types`, commitlint) and passed. Sub-tasks 1-4 were committed with `--no-verify` at your instruction; `check:types` and `eslint` were run manually for each and both were clean.

Needs manual UI check

Nothing below was verified in a browser or by pixel comparison. All of it is code-level checked against the plan's spec values only.

Copy after the later revision: *"Bạn đã không tham gia cuộc họp hôm nay **(06:00–06:30, 02 tháng 10, 2026)**. Hy vọng mọi chuyện đều ổn. Bạn có thể chia sẻ lý do bỏ lỡ buổi trò chuyện hôm nay không?"*

The reason modal is a brand-new component and the highest-risk item in this branch — it has never been rendered anywhere.

- `/{locale}/notifications` and the header popover: `autoCancelReadingSession` and `huberNoShowReadingSession` render as a single line with the time range bold blue and the Huber name bold, no title, no CTA, no reason box.
- The auto-cancel card must show the **Huber's** name (`Tran Thanh Thao`), not the sender. `relatedEntity.humanBook.fullName` is confirmed populated and the `sender` fallback was removed, so this should hold — but confirm visually.
- `missReadingSession`: no title line; body reads `11:00–11:30` with an en-dash and `05 tháng 2, 2025` (vi) / `05 February 2025` (en); the `Chia sẻ lý do` bar spans the full content column.
- `/{locale}/notifications` — miss card has no title line, bold blue range, full-width `Chia sẻ lý do`, pink background, icon top-left
- **The reason modal, opened from that CTA** — highest risk here; it has never been rendered. Confirm the summary card, red "Missed" pill, blue time block, avatar with its check badge, textarea focus ring, and that "Hoàn tất" persists the reason and closes. Also confirm it renders from the notification payload alone after a page refresh.
- The miss icon renders as a rounded square, not a circle (it is an `Avatar` whose base class is `rounded-full`, so this depends on the `rounded-2xl` override actually winning).
- Breakpoints `sm` (640px), `md` (768px), `xl` (1280px): confirm the full-width CTA does not overflow the 480px `NotificationPopover`.
- Vietnamese copy for all three types.
- Joining a real session confirms the `/attend` stamp lands and that a failing stamp is invisible in the meeting UI.
- **`/{locale}/my-schedule/[id]`** — new page. From an auto-cancel card, the row click must land here showing `canceled` and a "book this story again" action; from a huber no-show card, it must land here with the reason form open. Back button returns to `/my-schedule`. Nothing may route to `sessionUrl`.
- **New runtime risk from the router dependency.** `SessionOutcomeNotificationCard` now calls `useRouter` from `@/libs/i18nNavigation`, so the story needs App Router context to render. The build succeeds, but the story has not been run in a browser (see `test-storybook:ci` below), so this is unverified.

What was done

The client now tells the backend that a participant actually showed up. Right after the Agora join resolves, `AgoraMeeting` posts to `/reading-sessions/:id/attend`. It is fire-and-forget: failures are swallowed so they can never interrupt a live call, and the participant is derived from the JWT rather than the Agora UID, since every token we issue uses uid 0. This is what stops the post-meeting cron from marking every approved session as unattended and accusing innocent hubers of a no-show.

On the notification side, `huberNoShowReadingSession` and `autoCancelReadingSession` are new. They are structurally identical — one line of rich text, nothing to click — so they share a single new card that differs only in message key. The existing reader-facing `missReadingSession` card was rebuilt to match its design: the orange heading is gone, the session time and date are now bold blue in a spelled-out-month format instead of `05/02/2025`, and the "share the reason" button became a full-width bar. All three types key their copy off `type.name` and deliberately ignore `extraNote`, which carries a pre-rendered English message that would otherwise leak English into the Vietnamese card.

Notes / follow-up

- **`huberNoShowReadingSession` copy is a placeholder and needs product sign-off.** No design and no agreed wording were supplied. What shipped is an invitation to report a possible glitch on our side, which is a guess. Three non-accusatory options are drafted in #768 for product to pick; do not merge without a decision.
- **Unconfirmed backend contract: the Huber name on auto-cancel.** The card reads `relatedEntity.humanBook?.fullName` and falls back to `sender.fullName`. On an auto-cancel the sender is likely a system or admin account, so if `humanBook` is not populated the card will render the wrong name. Worth one confirmation with `hulib-services`.
- **The row on the rebuilt `missReadingSession` card still opens a modal**, unlike the two new cards which now navigate. Left as-is because it is pre-existing behaviour and out of scope, but the two are now inconsistent — worth deciding whether the miss card should also deep-link to `/my-schedule/[id]`.
- **Nested `<button>` in the miss card is still there.** `NotificationRow.tsx:45` renders the row as a `<button>` and the `Chia sẻ lý do` CTA is another `<button>` inside it. Invalid HTML, poor for screen readers, and the click bubbles so the reason modal opens twice. Pre-existing, and fixing it means changing `NotificationRow`, which affects every notification card. Left alone deliberately and flagged for a decision.
- **`/attend` has no time guard, so an early joiner counts as attendance.** The endpoint stamps on any call — joining 10 minutes before `startedAt` marks the session attended, which weakens the no-show signal the whole flow depends on. A BE guard rejecting stamps before `startedAt` minus a grace window (15 min suggested) is the fix; filed with the backend, small PR.
- **Both new types remain visually unverified.** They were built from the written spec on the #764 card's structure, not from a design. `huberNoShowReadingSession` in particular has no reference at all.
- **Body text weight may not match.** It is `font-medium` per #764, but both reference images read heavier. Expect to adjust after a real browser look.
- **No story for the rebuilt `missReadingSession` card.** `InformativeNotificationCard` pulls in the Redux-backed `SessionDetailCard`, the i18n router and a Modal, so a standalone story would need most of the app tree. It is covered only by typecheck. The new `SessionOutcomeNotificationCard` does have stories.
- **`test-storybook:ci` is broken independently of this work** — it calls a `test-storybook` script that does not exist, so the gate can never pass and CI has likely been no-op'ing. Tracked in #767.
- **Deploy order still matters.** `npx prisma migrate deploy` must run on the backend first, otherwise `/attend` errors and the cron query fails. Frontend deployment does not unblock this.
- The separator is rendered without spaces around the en-dash (`11:00–11:30`), following the design. Note #764's existing session-decision keys use a trailing space (`11:00– 11:30`), so the two styles now coexist in the same list.
