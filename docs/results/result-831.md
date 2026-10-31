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
