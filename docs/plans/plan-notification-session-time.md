# Plan: fix notification meeting start/end time + language-aware session times

Branch: feat/notification-request-meeting
Replaces: `docs/plans/plan-764.md` (deleted — that plan targeted the *old* `develop` card templates and misread the design, which keeps `createdAt` in the footer)

Design reference: `.ai/temp/image.png` (developer-supplied mock, not committed)

## Background

The meeting-request notification card showed a **blank date** and the **wrong time**. All three session-time renderers added on this branch read `relatedEntity.startTime` / `endTime`, which the backend sends as bare `"HH:mm"` wall-clock strings:

```
startedAt: "2026-10-02T21:45:00.000Z"   ← real instant
startTime: "19:11"                      ← 2h35m out of sync, and not a parseable date
```

`new Date("19:11")` is an `Invalid Date`, which produced three separate failures:

| Site | Symptom |
| --- | --- |
| `MeetingRequestNotification.tsx:78` | `formatMeetingDateLabel` returned `''` → **blank date** |
| `MeetingDecisionModal.tsx:54` → `getTimeLeftLabel` | `NaN` slipped past `if (diffMs <= 0)` → rendered **"NaNd NaNh left"** |
| `SessionDecisionNotification.tsx:45-46` | unguarded `format()` threw `RangeError`, swallowed by `ItemBoundary` into `null` → **approval/rejection cards rendered nothing at all** |

## Sub-tasks

| # | Sub-task | Done condition |
| ----- | -------- | -------------- |
| 1 | `src/utils/dateUtils.ts` — add a private `toDate` guard; add `resolveSessionTimeRange(entity)` returning `{ startedAt, startTime, endTime }`; make `formatSessionTime` pass an `"HH:mm"` string through untouched, reduce an ISO datetime to `"HH:mm"`, and return `''` for anything else; add `formatNotificationTimestamp` for the footer | Verified against the real payload: `Sat, 03/10/2026` + `19:11`→`19:41` (`en`), `Thứ 7, 03/10/2026` + `19:11`→`19:41` (`vi`); `formatSessionTime('2026-10-02T21:45:00.000Z')` → `04:45`, `formatSessionTime('nope')` → `''`, `resolveSessionTimeRange(null)` → all empty |
| 2 | `MeetingRequestNotification.tsx:78,130,134` — source the "Thời gian" block from `resolveSessionTimeRange(session)` instead of `session.startTime` / `endTime` | The block shows the **booked meeting** date and range and never `19:11`; matches `.ai/temp/image.png` — **needs manual browser check** |
| 3 | `MeetingRequestNotification.tsx:186` — swap `toLocaleDateString(createdAt, …)` for `formatNotificationTimestamp`, which includes the clock time | Footer reads `Sun 27 Sep 11:19` (`en`) / `CN 27 thg 9 11:19` (`vi`) instead of a date with no time — **needs manual browser check** |
| 4 | `MeetingDecisionModal.tsx:53,54,107,111` — same resolver, and add a `Number.isNaN(diffMs)` guard to `getTimeLeftLabel` | The accept/reject modal's date and range match the card behind it, and `"NaNd NaNh left"` cannot render |
| 5 | `SessionDecisionNotification.tsx:45-46,101-102` — same resolver | `SESSION_APPROVAL` and `SESSION_REJECTION` cards **render** instead of vanishing; `date-fns` can no longer throw `RangeError` because `startedAt` arrives pre-validated |
| 6 | Run the gates | `npm run lint` clean, `npm run check:types` adds no new errors, `npm run test` green, `npm run check:i18n` green |

## The model: two field pairs, two different jobs

| Field | Supplies | Rendered as |
| --- | --- | --- |
| `startedAt` | the **date** only — its time component is redundant | `Fri, 02/10/2026` |
| `startTime` / `endTime` | the **time** only — the times the meeting was booked for | `19:11` → `19:41` |
| `createdAt` | when the notification itself arrived (footer) | `Sun 27 Sep 04:19` |

Everything renders **exactly as the API returns it**, on a UTC basis, so the card no longer
shifts with the viewer's timezone. Verified identical under `UTC`, `Asia/Bangkok` and
`America/Los_Angeles`.

Payload used for verification:

```json
{
  "startedAt": "2026-10-02T21:45:00.000Z",
  "startTime": "19:11",
  "endedAt": "2026-10-02T22:45:00.000Z",
  "endTime": "19:41"
}
```

Conflating the two pairs is what caused the original bugs. Reading `startTime` as a date
(`new Date('19:11')` is an `Invalid Date`) blanked the date label, rendered `"NaNd NaNh left"`,
and threw a `RangeError` that `ItemBoundary` swallowed into a blank approval/rejection card.

## Decisions / risks

- **Two times are shown, by design.** Per the mock, the "Thời gian" block is the **booked meeting** and the line below the orange border is **when the notification was created**. They answer different questions and can be days apart, so `createdAt` is *not* replaced. The earlier `plan-764.md` wrongly assumed it was.
- **The footer gained a clock time.** `toLocaleDateString` formats only `weekday/day/month/year`; the mock shows `Mon 3 Feb 12:42`. `formatNotificationTimestamp` uses `EEE d MMM HH:mm` to match.
- **`endedAt` is now unused.** It only ever duplicated `endTime`; the end time comes from `endTime`. Still in the payload, no longer read.
- **Three rendering bases were tried and settled:** browser-local (date shifted a day for GMT+7 viewers), UTC-everywhere including the *time* (`21:45 → 22:45`, which contradicts `startTime`), and finally **date from `startedAt` on UTC + time from `startTime` verbatim** — which is what the product asked for.
- **`getTimeLeftLabel` still counts down against `startedAt`.** A countdown needs an absolute instant and `startTime` carries no date, so `startedAt` is the only option. The badge and the displayed time therefore come from different fields and can disagree — **flagged, not resolved.**
- **The whole card is UTC while `SessionDetailCard`, `my-schedule` and `UserActivityList` remain browser-local.** A session can show one time on the notification card and another on the schedule page. Worth a follow-up to make the app agree.
- **Session times are 24-hour in every language — `AM`/`PM` was tried and reverted.** A language-aware `formatSessionTime` (`vi` → `HH:mm`, `en` → `h:mm a`) was implemented first, but `AM`/`PM` has no counterpart in the Vietnamese UI. Language-dependence lives in `formatMeetingDateLabel` and `formatNotificationTimestamp`, where weekday and month names genuinely differ. Note the original `locales` argument was dead code precisely because `'HH:mm'` is locale-invariant.
- **The date + time range do not sit on one line, and forcing it failed.** The mock shows them side by side, but `MeetingRequestNotification.tsx:123-127` is `flex flex-col` and only becomes `xl:flex-row` when `showExtras` is true — so it stacks in the 480px popover (`showExtras={false}`). Forcing `flex-row` everywhere was tried and reverted: the block is too narrow and the date wraps mid-string. **Open** — needs a narrower date format, a smaller time font, or a wider popover.
- **The mock's date format was not applied.** The mock reads `Tue, 18 February, 2026`; `formatMeetingDateLabel` produces `Fri, 02/10/2026`. The mock is dated February and may predate the current spec, so the existing format was left alone — **open question.** Note `SessionDecisionNotification` deliberately uses a third format (`dd MMMM yyyy` / `dd tháng M, yyyy`), also untouched.
- **The Vietnamese weekday convention was preserved.** `formatMeetingDateLabel` hand-builds `Thứ 2`…`Thứ 7` / `Chủ Nhật` because date-fns' `vi` locale spells out `Thứ Ba`.
- **Two pre-existing type errors in `NotificationPopover.tsx:116,198`.** Confirmed present before this change via `git stash`; not touched here.
- **No new i18n keys.** All copy already exists (`session_time_label`, `requested_by`, `time_left`, …); only formatting changed.
- **No Storybook story and no new Jest test.** `.storybook/preview.tsx` provides neither `NextIntlClientProvider` nor a Redux `Provider`, so a card story would crash. Correctness was verified by throwaway Jest runs against the real helpers (output quoted in sub-task 1) and should be locked in with a permanent test as this module grows.
- **Backend drift remains.** `startTime` vs `startedAt` drift is an `hulib-services` defect needing its own issue; this change only stops the frontend from rendering the drifted `startedAt` time.
