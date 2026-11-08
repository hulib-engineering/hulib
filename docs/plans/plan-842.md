# Plan: feat: add post-meeting feedback popup for Liber

Issue: #842
Branch: feat/842-post-meeting-feedback-popup

## Sub-tasks

| # | Sub-task | Done condition |
| ----- | -------- | -------------- |
| 1 | Add/align the `feedback_form` keys in `src/locales/en.json` and `src/locales/vi.json`: step-1 title (`Phản hồi cho buổi gặp mặt`), cancel/next, Huber label/placeholder, success paragraph, home CTA (`Tiếp tục đọc sách`). Reuse existing keys where they already match (`how_do_you_feel`, `did_session_satisfy`, `feedback_for_huber`, `how_many_love`, `thank_you`, `skip`, `confirm`). | Keys exist in both files and `npm run check:i18n` passes. |
| 2 | Extract the duplicated meeting-summary block into `src/features/meeting/components/SessionSummaryCard.tsx` (or `src/layouts/scheduling/` if it stays schedule-generic): blue `primary-60`-style 1.5px border, 16px radius, `Thời gian` row + inner light-blue box with bold date and `HH:mm → HH:mm`, `Người tham dự` row with avatar + Liber/Huber chip + name. Reuse `ScheduleInfoItemLayout`, `SessionAttendees`/`Avatar`/`Chip` rather than new DOM. Replace the copy in `src/app/[locale]/(auth)/reading/[id]/post-survey/page.tsx`; leave `SessionDetailCard` untouched unless it can adopt the same props safely. Add a Storybook story. | Post-survey and the popup render the shared component with no duplicated markup; `check:types` + `lint` pass — **needs manual browser check**. |
| 3 | Add the presentational steps in `src/features/meeting/components/feedback/`: `SessionFeedbackStep` (2 × `EmojiRateScale` with `Không tốt`/`Rất tốt` and `Không hài lòng`/`Rất hài lòng`, 32px emoji + 8px selected blue ring ≈48px outer, plus textarea), `HuberFeedbackStep` (centered 96px avatar, gradient `Huber` chip, verified name, 5 × `Rating` hearts at `size-8`–`size-10` pink-50, label + textarea), `FeedbackSuccessStep` (full-bleed illustration, thank-you title/paragraph, full-width CTA). Reuse `EmojiRateScale`, `Rating`, `TextArea`, `Button`, `Avatar`, `Chip`. Add stories for each step. | Each step renders standalone with mock props; step 2 Confirm is disabled until a heart is selected; Skip is always enabled; `check:types` + `lint` pass — **needs manual browser check at 375 / 768 / 1280 / 1440**. |
| 4 | Add `PostMeetingFeedbackModal` controller in the same folder: `Modal` from `src/components/Modal.tsx` with `disableClosingTrigger`, `step` state (`session` → `huber` → `success`), local form state, `Hủy bỏ` → cancel callback, `Bỏ qua` → submit step 1 with `huber.skipped = true`, `Xác nhận` → submit both. Mobile: near full-screen with scrollable body and pinned footer; `sm`/`md` centered; `xl` `max-w-xl`–`max-w-2xl`. | Modal cannot be dismissed by backdrop/Escape; all transitions work without navigation; type/lint pass — **needs manual browser check**. |
| 5 | Extend the FE reading-session types and services: add `feelingRating`, `satisfactionRating`, `sessionContent`, `huberRating`, `huberContent`, `huberFeedbackSkipped`, `feedbackSubmittedAt` to `src/libs/services/modules/reading-session/createNewReadingSession.ts` (or the shared type) and add `submitReadingSessionFeedback` (`POST reading-sessions/:id/feedback`) to the `reading-session` RTK Query module with cache invalidation for `ReadingSession` and `Notification`. | `npm run check:types` passes and the mutation body matches the hand-off contract below. |
| 6 | Wire the modal into `src/app/[locale]/(auth)/reading/page.tsx` + `MeetingShell` end flow. After `POST /end` succeeds, if `isViewerLiber` and `readingSession.feedbackSubmittedAt` is empty, open the modal instead of `router.push('/notifications')`; on successful submit/skip → success step → `router.push('/')`; `Hủy bỏ` → `router.push('/')` without submitting. Huber keeps the existing redirect. If `POST /end` fails, keep today’s navigate-away behaviour. Invalidate the session query so a refresh does not reopen the popup. | Manual, timeout, and peer-end flows all show the popup for Liber only; Huber never sees it; refresh/revisit does not reopen; **needs manual browser check**. |
| 7 | Refactor or retire `/reading/[id]/post-survey`: render the shared `SessionFeedbackStep`/`HuberFeedbackStep`/`FeedbackSuccessStep` there (preferred) or redirect to `/` if the route is considered dead. Do not leave a second copy of the step markup. | No duplicated step markup remains; route still resolves (or redirects) and type/lint pass. |
| 8 | Add the success illustration when design exports it (`public/assets/images/feedback/feedback-success-illustration.png`, ~1080×1080, white/transparent background). Until then use the closest existing asset as a placeholder and flag it. Then run all gates: `npm run lint`, `npm run check:types`, `npm run check:i18n`, `npm run test`. | All four gates pass; illustration displays at full width — **needs manual browser check**. |

## Backend hand-off contract (spec only — no backend work in this task)

- `GET /reading-sessions/{id}` must return the meeting summary plus `feedbackSubmittedAt`; the popup is suppressed when it is not null.
- `POST /reading-sessions/{id}/feedback` (reader/Liber only, finished sessions only, idempotent):
  ```json
  {
    "feelingRating": 3,
    "satisfactionRating": 3,
    "sessionContent": "optional",
    "huber": { "rating": 4, "content": "optional", "skipped": false }
  }
  ```
- Ratings `1..5`; step-2 text optional; skipped sessions send `huber.skipped = true` and no rating.
- Proposed persistence (for the backend team to confirm, not implemented here): `feelingRating`, `satisfactionRating`, `sessionContent`, `huberRating`, `huberContent`, `huberFeedbackSkipped`, `feedbackSubmittedAt` on `readingSession`; keep the existing reader→Huber `feedback` row in sync for profile ratings.

## Decisions / risks

- **Backend dependency:** the `POST /reading-sessions/{id}/feedback` endpoint does not exist yet. FE can be implemented against the contract, but end-to-end submission cannot be verified until it ships. Keep `feedbackSubmittedAt` optional in the type so existing sessions still render.
- **No backend edits in this task:** no changes to `hulib-services`, no BE issue, no migrations. The contract above is a hand-off only.
- **Trigger point:** only after a successful `POST /end`. A failed end call must not trap the user in the popup because feedback requires `sessionStatus === finished`.
- **Cancel vs skip:** `Hủy bỏ` exits to home without submitting; `Bỏ qua` is only step-2 skip and still submits step 1, then shows success.
- **Step-2 validation:** a heart rating is required to confirm; the textarea is optional (the design has no required marker).
- **Success illustration is missing from `public/assets`.** The closest files (`our-mascots.png`, `Hulib Webapp.png`) are different scenes; a new export is required.
- **Visual verification is not performed by the AI.** No screenshots are captured and no design images are committed; every visual sub-task is flagged for a manual browser check.
- **Storybook tests are CI-only** (`test-storybook:ci` drives Playwright); do not run them locally.
- **Responsive:** base mobile (full-screen sheet), default `sm`/`md` centered, custom `xxl` (1440px) is the only extra breakpoint in `tailwind.config.ts`; verify 320px does not overflow the 5-icon rows.
