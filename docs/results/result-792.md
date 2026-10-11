Result: feat: rebuild 1:1 meeting room UI to design with screen-share rail and resilience

What changed

- src/features/meeting/types.ts: new. Domain types — layout mode, connection state, device permission state, participant, cloud recording info, screen-share source/status.
- src/features/meeting/utils/formatDuration.ts: new. Pure zero-padded `HH:MM:SS` plus `elapsedSecondsSince`. Derives elapsed time from a start timestamp instead of counting ticks, so a re-render cannot make the badge drift.
- src/features/meeting/utils/agoraToken.ts: new. `readAgoraToken` repairs the `+` characters the query string decoded into spaces. Extracted out of the Agora hook so it can be unit tested — the SDK does not initialise under jsdom.
- src/features/meeting/utils/layout.ts: new. Pure `resolveLayoutMode` and `isRailViewport` (`xl` = 1280px).
- src/features/meeting/hooks/useMeetingSession.ts: new. Owns the Agora lifecycle. Join effect depends on `[channel, token, sessionId]` only, so it cannot re-join mid-call. Late-joiner subscribe consolidated into `publishExistingRemoteTracks`. Binds `connection-state-change` and `exception`. Attendance stamp preserved verbatim, including its deliberately empty `catch`.
- src/features/meeting/hooks/useMeetingDevices.ts: new. Mic/camera toggles plus per-device permission state derived from the DOM error name. Silent `catch {}` blocks replaced with surfaced errors.
- src/features/meeting/hooks/useScreenShare.ts: new. Screen sharing on raw `getDisplayMedia` wrapped in `createCustomVideoTrack`. System audio published as its own Agora track. Restores the camera on all three stop paths.
- src/features/meeting/hooks/useMeetingRecording.ts: new. Recording lifecycle with start/stop toasts and unload teardown. `startedAt` stamped when `startRecording` resolves.
- src/features/meeting/hooks/useMeetingSocket.ts: new. Single owner of the room's socket traffic — reactions, in-call chat, and call-ended.
- src/features/meeting/components/ParticipantTile.tsx: new. Name badge (primary blue for self, orange for remote), mic **and** camera badges bottom-left, avatar `size-40` local / `size-16` remote.
- src/features/meeting/components/ControlBar.tsx: new. Four `!size-11` buttons centred with `mx-auto`; heart pinned far right. Invisible spacer buttons removed.
- src/features/meeting/components/MeetingStage/MeetingShell.tsx: new. Remote occupies the main stage, local is picture-in-picture top-right with a white ring — the reverse of the previous arrangement.
- src/features/meeting/components/ScreenSharePicker.tsx: new. Custom source grid with `Include system audio`, degrading to the native picker when no sources are exposed.
- src/features/meeting/components/RecordingBadge.tsx: new. Blue pill with red dot, rendered left of the topic.
- src/features/meeting/components/RecordingConsentModal.tsx, EndCallConfirmModal.tsx, ReconnectingOverlay.tsx, DeviceStatusBanner.tsx: new.
- src/app/[locale]/(auth)/reading/page.tsx: renders the new shell behind the same `ssr: false` dynamic boundary. Pre-survey gate and `handleEndCall` flow preserved.
- src/layouts/reading/AgoraMeeting.tsx, src/layouts/reading/RecordingTimer.tsx, src/components/meeting/PlayableAgoraMeetView.tsx: **deleted** (632 + 38 + 128 lines). Verified unreferenced before removal.
- src/locales/en.json, src/locales/vi.json: `Reading.AgoraMeeting` grew from 8 to 46 keys, in sync.

Gates

- `npm run lint`: pass for this branch's scope. 38 errors repo-wide vs **39 on develop** — this branch introduces zero new lint errors and removes one (the deleted `RecordingTimer`). Verified by diffing the set of files with errors against `origin/develop`; the set is empty.
- `npm run check:types`: pass. No errors in `features/meeting/**` or `reading/page.tsx`.
- `npm run check:i18n`: pass. No missing, invalid, or unused `AgoraMeeting` keys. Remaining findings are pre-existing in other namespaces.
- `npm run test`: pass. 8 suites, 48 tests.
- `npm run test-storybook:ci`: not run locally — CI only (see `.ai/skills/implement-plan.md`).

Needs manual UI check

The AI does not capture screenshots and does not run the dev server. **Sub-tasks 4, 5, 6, 7, 9 and 10 are visually unverified.** On `/{locale}/reading?channel=session-<id>&token=...` with two browsers:

- **Layout inversion (sub-task 5, highest risk)** — confirm the remote participant fills the stage and your own video is the PiP tile top-right. This reverses the previous default for every existing meeting.
- **Tile badges (4)** — self badge reads "You" in blue, remote badge reads the partner's name in orange; both mic and camera badges render bottom-left; avatar sizes correct when the camera is off.
- **Control bar (6)** — four buttons centred, heart at the far right, `opacity-50` until tracks are ready.
- **Recording badge (7)** — blue pill with red dot sits left of the topic and counts from the moment recording actually starts.
- **Screen share picker (9)** — panel renders with the source grid; confirm on Chrome and Firefox. Firefox/Safari may expose no sources, which should show the degrade path.
- **Rail mode (10)** — while sharing, the card narrows and both participants stack in a rail to the right, outside the card.

Also confirm with two real browsers: **reactions and in-call chat both deliver** after the `useSocket` consolidation, since socket lifecycle timing changed and this cannot be verified statically.

What was done

The 1:1 reading room was rebuilt as a `src/features/meeting` module matching the repo's `admin` / `stories` / `users` convention. The 632-line god component and its 18 `useState` hooks are gone, replaced by six focused hooks and seven presentational components built on the existing `core/` primitives. The stage layout now matches the supplied designs (remote spotlight, local PiP, camera badge added, recording pill repositioned), screen sharing gained a real custom picker with a system-audio option, and the camera now restores when sharing stops — from our button, from the browser's native "Stop sharing" bar, or when the peer stops.

Notes / follow-up

- **Two silent bugs were fixed that the plan did not call out as separate items.** The system-audio option was a no-op in the first draft of `useScreenShare` because `getDisplayMedia`'s audio track was never published; it is now published as its own Agora track. And the camera-restore path recreates the camera track but leaves `isCameraOn` false — the user must press the camera button again after a share, which is correct but should be verified in the browser.
- **`restoreCamera` intentionally leaves the camera muted.** Recreating the track and publishing it disabled avoids surprising the peer with a camera that silently comes back on. This differs from the old behaviour and is worth confirming against the design intent.
- **Recording consent remains asymmetric.** Only the Liber is prompted; Hubers are never asked. Pre-existing and left alone, but `Schedule.MainScreen.subtitle2` claims recordings need *both* participants' consent. Worth a follow-up.
- **Rail mode is desktop-only.** Below `xl` the rail is not rendered and the shared screen takes the full stage. Responsive conversion to a bottom thumbnail strip is the explicit out-of-scope item in #792.
- **The shared screen stage is a placeholder.** While sharing, the main stage shows the `screen_label` text rather than a local preview of the shared track, because the design places the shared screen on the main stage but the remote participant's copy of it is the one worth showing. This needs a decision before merge.
- **Core `Popover` still hard-codes `z-[999999]`** (`src/components/core/popover/Popover.tsx:128`). Left alone as out of scope; the tile overlays now share one exported `TILE_OVERLAY_Z` token instead of `z-[12312]`/`z-[999999]`.
- **Two pre-existing defects outside the meeting room were left untouched**: `post-survey/page.tsx:124` gates on `readingSession?.status` but the type declares `sessionStatus`; `useScheduleMeetings.ts:66` reads `b.createdAt`, which is not on `ReadingSession`.