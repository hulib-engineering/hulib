# Plan: fix: enforce reading session end on timeout/peer end with proper teardown

Issue: #831
Branch: fix/831-enforce-reading-session-end-on-timeout-peer-end-with-proper-teardown

## Sub-tasks

| # | Sub-task | Done condition |
| --- | -------- | -------------- |
| 1 | Route guard on /reading | If sessionStatus is finished/cancelled/missed/rejected, redirect before mounting MeetingShell/Agora. No connection attempted. |
| 2 | Drop now < endedAt bail in handleEndCall() | Remove early return in src/app/[locale]/(auth)/reading/page.tsx. Let backend/time decide. Still stop recording + update session. |
| 3 | Auto-end timer based on endedAt | Add timer using endedAt from session to trigger end flow at/after expiry. Show "Session ended" state/overlay before navigating. |
| 4 | Act on peer call-ended | In useMeetingSocket/MeetingShell, on call-ended actually call session.leave(), stop tracks, navigate away for peer (not just flag). |
| 5 | Explicit teardown on all end paths | Explicitly call leave() in manual end, timeout, peer-end. Don't rely only on unmount. |
| 6 | Idempotent finish + BE coordination | Use POST /api/v1/reading-sessions/:id/end if available (preferred). Else PATCH with idempotent handling (treat 200 when already finished as success). Ask BE to confirm endpoint/emit/ordering. |
| 7 | i18n keys | Add keys for session ended/timeout to src/locales/en.json and src/locales/vi.json, keep in sync. npm run check:i18n passes. |

## Decisions / risks

- BE prefers POST /api/v1/reading-sessions/:id/end (atomic: mark finished, stop recording if active, emit call-ended, idempotent). If delayed, harden PATCH with participant authZ, early return if finished, emit call-ended, no FE time enforcement.
- call-ended must be emitted by BE for reliable peer auto-end; FE can emit as fallback.
- Don't block based on FE clock vs endedAt - use API's endedAt/source of truth; backend will enforce.
- Both sides can end simultaneously - must be idempotent regardless of endpoint.
- Need BE confirmation: (1) does /end stop recording or must FE call stop? (2) exact socket event name + namespace/room (3) finishedAt/finishedBy in GET? (4) tooEarlyToEnd enforced?
- Needs manual browser check for "Session ended" overlay.
