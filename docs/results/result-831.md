Result: fix: enforce reading session end on timeout/peer end with proper teardown

What changed
src/libs/services/modules/reading-session/endReadingSession.ts: POST /reading-sessions/:id/end client
src/libs/services/modules/reading-session/index.ts: export useEndReadingSessionMutation
src/app/[locale]/(auth)/reading/page.tsx: terminal-status route guard; drop now<endedAt bail; call end API (idempotent); pass endedAt
src/features/meeting/components/MeetingShell.tsx: auto-end timer on endedAt; peer call-ended → leave; explicit leave() on all end paths; session-ended overlay
src/features/meeting/components/SessionEndedOverlay.tsx: overlay for timeout / peer / manual end
src/locales/en.json + vi.json: session_ended*, session_ended_timeout, session_ended_by_peer, session_ended_leaving

Gates
- lint: pass (0 errors; 102 pre-existing warnings)
- check:types: pass
- check:i18n: pass (no missing keys; remaining invalid/unused/undefined findings are pre-existing and unrelated)
- test: pass (8 suites, 48 tests)
- test-storybook:ci: not run locally — CI only (see .ai/skills/implement-plan.md)

Needs manual UI check
- /reading with live session: End call → overlay → both sides leave → notifications
- Wait until endedAt: auto overlay “Session time is up” then leave
- Peer ends: other side sees “other person ended” overlay then leaves
- Reopen /reading?channel=… for finished/canceled/missed/rejected: redirect, no Agora join

What was done

Liber and huber can end anytime; session also ends at API endedAt. Peer gets call-ended (BE /end + FE socket fallback). Agora leave is explicit. Terminal sessions cannot remount the meeting shell.

Notes / follow-up
- Depends on BE hulib-services#404 (POST …/end + call-ended emit). Deploy BE with FE.
- Recording still stopped on FE before /end; BE does not stop recording yet.

Post-review fixes (screen-share end stuck + auto-end + hide recording)
Root cause: teardownAndEnd was one try/finally with no catch; share.stop() → restoreCamera →
createCameraVideoTrack threw NOT_READABLE (suspended camera track was only stopped, never
closed, so the device stayed held), aborting the whole teardown: peer never notified, Agora
never left, POST /end never called → stuck “Leaving the meeting…” overlay.

- useScreenShare.ts: added teardown() (unpublish+close screen tracks, NO camera restore —
  leave() closes the rest); restoreCameraTrack now catches restore failures instead of rethrowing.
- MeetingShell.tsx teardownAndEnd: notify peer FIRST (best-effort); each step (share.teardown,
  rec.stop, leave) isolated in its own try/catch; finish() always runs.
- MeetingShell.tsx restoreCamera: closes the previous suspended cameraTrack before recreating;
  createCameraVideoTrack wrapped in try/catch → returns null + setIsCameraOn(false) instead of
  throwing; publish failures no longer propagate.
- MeetingShell.tsx auto-end: one-shot setTimeout replaced with a 1s setInterval re-check
  (plus immediate tick) so a throttled/missed timer cannot leave the call running past endedAt.
- reading/page.tsx: effectiveEndedAt fallback — if the API omits endedAt, derive it from
  startedAt (ISO) + (endTime − startTime) duration (bare "HH:mm").
- MeetingShell.tsx: SHOW_RECORDING_PROMPT = false flag hides the recording-consent modal
  (implementation kept, flip the flag to re-enable).

Gates re-run after these fixes: lint 0 errors (102 pre-existing warnings); check:types pass.
Needs manual UI check (cannot be verified without a browser):
- End the call while screen sharing → overlay appears, both sides leave, no stuck “Leaving…”.
- Session reaches endedAt while sharing → auto-ends cleanly.
- Recording consent modal no longer appears for the Liber.

Final hardening (BE-driven end + diagnostics)
- src/features/meeting/utils/resolveMeetingEndAt.ts (new): deadline = API endedAt (ISO),
  or startedAt + (endTime − startTime) duration as fallback. Never interprets endTime as
  local clock hours (session 4014: 07:00 treated as VN local → 00:00Z armed and hung up on
  join). reading/page.tsx uses it via effectiveEndedAt.
- [831] diagnostics across the whole chain: session query + API timing (page.tsx), auto-end
  arming / 15s heartbeats / deadline (MeetingShell), each teardown step 1/5…5/5, manual
  end, raw socket "call-ended" receive (useMeetingSocket), POST /end, terminal redirect.
  Console filter: 831.
- reading/page.tsx: 30s session-status poll — a BE-side auto-end is noticed within ≤30s
  even if the local timer and the call-ended socket both miss; terminal status redirects
  out of /reading.
- BE (hulib-services, separate repo/PR): delayed Bull job "auto-end-session" at endedAt +
  every-minute sweep cron finish the session system-side and emit call-ended to BOTH
  participants. FE is no longer the only enforcement layer; either side alone can end it.

Gates re-run after final edits: lint pass (0 errors, 102 pre-existing warnings);
test pass (8 suites, 48 tests); check:types runs in the pre-commit hook.
Needs manual UI check (cannot be verified without a browser):
- Join /reading, wait for endedAt: auto overlay → both sides leave within ~1s of deadline.
- Filter console by 831: confirm "auto-end ARMED" shows a sane remainingSec (no >1h
  timezone skew), then DEADLINE / call-ended / redirect lines fire in order.
