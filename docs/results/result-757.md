Result: feat: add timeSlotReminder notification card

What changed

- `src/components/notification/private/types.ts`: added `TIMESLOT_REMINDER = 'timeSlotReminder'` to the `NotificationType` enum.
- `src/components/notification/private/config.tsx`: added the `notificationConfig` entry — a fixed `getMessage` (no interpolation, no `relatedEntity` access) and a role-aware `route` that sends Hubers to `/my-schedule?tab=timeslots` and everyone else to `/my-schedule`.
- `src/components/notification/private/registry.tsx`: registered `TimeSlotReminderNotificationCard` for the new type.
- `src/components/notification/styles/TimeSlotReminderNotification.tsx` (new): the card itself — a 72px calendar icon, message, full-width pill CTA, unread leaf.
- `src/app/[locale]/(auth)/my-schedule/page.tsx`: seeded the existing `showMobileTimeslotRegistration` state from `useSearchParams().get('tab') === 'timeslots'` so the deep-link opens the timeslot editor.
- `src/locales/en.json`, `src/locales/vi.json`: added `time_slot_reminder_message` and `time_slot_reminder_cta` under `notifications`.

Visual verification

- reference: `.ai/references/757/design-01.png` — supplied late, as `.ai/temp/757a.png`, after the code was first written.
- implemented: **no screenshot** — `/notifications` is behind the auth guard in `src/middleware.ts`, there is no public equivalent, and the local dev server could not be started (see Gates). No screenshot was faked.
- **Still needs a manual UI check** in a browser against `.ai/references/757/design-01.png`.

### Corrections made after the design reference arrived

Comparing the rendered code against `design-01.png` exposed two real defects, both caused by the earlier text-only issue (the screenshot could not be read when the issue was written). Fixed in `fbd4f35a`:

1. **The circular badge was wrong and has been removed.** The card wrapped the icon in a `rounded-full border-2 border-primary-50 bg-primary-98` circle. The design shows a plain solid-blue calendar glyph with no circle, no border and no tinted background. The circle came from the Figma **`logo` node, which the spec marks `display: none`** — the hidden node was implemented instead of the visible `CalendarPlus` node. The wrapper `div` is kept purely for layout and responsive sizing (`size-14 xl:size-[72px]`), and the icon now fills it via `size="100%"`.
2. **The CTA label was wrong.** It read "Update personal schedule" / "Cập nhật lịch cá nhân"; the design reads **"Update now" / "Cập nhật ngay"**. The spec's own `Button` label width of 107px was consistent with the shorter string. Both locale files updated.

Side effect: the shorter label removed the 320px overflow risk that motivated the responsive badge sizing in the first place, though the `size-14 xl:size-[72px]` sizing was kept because it still matches the other notification cards.

What was done

The backend's new `timeSlotReminder` type previously fell through the `?? notificationRegistry[NotificationType.OTHER]` fallback and rendered as the "It's time for your session" card, which is misleading copy for a schedule-maintenance nudge. It now has a dedicated card.

Layout was derived directly from the spec's box arithmetic and lands on the specified dimensions: card 120px tall (32px padding + 48px two-line message + 8px gap + 32px button) and a ~520px message/button column against the spec's 514px, at the real 680px card width inside the 728px `lg` notifications shell.

The `Button` primitive turned out to match the spec without arbitrary values — `variant="fill"` supplies `bg-primary-50` (`#0442BF`), `size="sm"` supplies `h-8` (32px) and `text-sm` (14px), and `rounded-full` with `font-medium` is baked into the common styles. Only the 1px same-colour border and the `text-primary-98` label colour were added. No `hover:` utility was passed in `className`, which would have suppressed the built-in hover overlay (`Button.tsx:42`).

The badge deliberately does not reuse `Avatar`: `Avatar` has no 72px size, and with no `imageUrl` it renders a generated identicon. It uses `CalendarPlus` from `@phosphor-icons/react` (already a dependency, previously unused) in a plain `div`, following the badge precedent in `SystemNotification.tsx:38`. Per `design-01.png` the icon is a bare solid glyph — the surrounding circle, border and tinted background that the Figma `logo` node described are deliberately **not** rendered, because that node is `display: none` in the spec.

The card root is a `div`, not a `button`, so the CTA button is the only interactive element. The passed `onClick` is invoked from the button handler, which is what triggers `markAsSeen` in `NotificationItemRenderer.tsx:34` — the card does not call `useNotificationActions` itself, avoiding a double PATCH.

## Gates

| Gate | Result |
| ----- | ------ |
| `npm run check:types` | **Could not run.** `node_modules/.bin/` is missing, so npm resolves `tsc` to an unrelated global binary from a Yarn bin directory that reports `moduleResolution: "bundler"` as invalid. Run directly via `node node_modules/typescript/bin/tsc --noEmit` (TypeScript 5.9.3) instead — see the delta below. |
| `npm run lint` | **Could not run.** `node_modules/eslint` is 8.57.1 while the repo uses flat config (ESLint 9), and `@eslint/eslintrc` is absent, so `eslint` aborts on startup. |
| `npm run check:i18n` | **Could not run.** `@lingual/i18n-check` is declared in `package.json` but is not installed. Substituted a manual recursive key-parity diff of `en.json` against `vi.json`: **1089 keys each, 0 missing, 0 extra**. Both new keys are referenced in source, so neither is an orphan. |
| `npm run test` | Not run — `node_modules` is incomplete (see below). No test files were added or changed. |
| `npm run test-storybook:ci` | Not applicable — no story was added (by decision, see plan). |
| Dev server / screenshot | Not possible — `node_modules` is missing `@types/react`, `@phosphor-icons/react`, `@reduxjs/toolkit/query` and `@playwright/test`, so the app cannot build or serve. |

### Typecheck delta (the one gate that could be approximated)

A normalised before/after diff of `node node_modules/typescript/bin/tsc --noEmit` against a clean `origin/develop` baseline, with line/column stripped so results are comparable:

- **Zero** new errors in any pre-existing file.
- The two expected `TS2741 Property '[NotificationType.TIMESLOT_REMINDER]' is missing` errors in `config.tsx` and `registry.tsx` appeared after the enum addition and are **resolved** by the config/registry entries.
- The new component contributes only repo-wide environment noise that every existing `.tsx` also produces: 12× `TS7026` (no `JSX.IntrinsicElements`, because `@types/react` is missing), 1× `TS7016` (no declaration file for `react`), 1× `TS2307` (cannot find `@phosphor-icons/react`). No genuine type error in the new code.

## Notes / follow-up

- **Toolchain is broken and was not repaired.** `node_modules` is missing its `.bin` shim directory plus `@types/react`, `@phosphor-icons/react`, `@reduxjs/toolkit`, `@playwright/test` and `@lingual/i18n-check`. A pre-existing `git stash` list (`lint-staged automatic backup` × 4) suggests a previous interrupted `lint-staged` run. Run `npm install` before trusting any gate, and re-run all of the above.
- **All five commits were made with `--no-verify`**, at the user's explicit instruction, because the pre-commit hook cannot start without a `lint-staged` shim. This bypassed ESLint and `check:types` entirely, so **the committed code has not been linted or typechecked by the real toolchain.** Please run `npm install && npm run lint && npm run check:types` and fix anything that surfaces.
- One lint error was caught by hand instead: the new file originally had a bare `import React from 'react'`, which `unused-imports/no-unused-imports` would have flagged. `SystemNotification.tsx`, the closest structural analogue, has no React import. Removed in `c54149da`. Treat this as a sample, not a substitute for a real lint run — other style issues may remain.
- **Sub-tasks 3, 4 and 6 landed as one commit** (`8f281cf2`) because they all live in the single new file and cannot be split without committing a knowingly broken intermediate state. Sub-tasks 1, 2, 5 and 7 are separate commits.
- **No timestamp on the card, per explicit decision.** The spec's frame is 88px = 48 + 8 + 32 and the card is 120px = 88 + 32, leaving no room for a date row. This card is therefore the only notification card without a visible created-at date. If a date is wanted, the card grows to ~142px and the design no longer matches.
- **The badge is 56px below `xl` and 72px at `xl` and above.** The spec's 662px card is a desktop width; a fixed 72px badge at 320px left only ~168px for the CTA and `Button` sets `whitespace-nowrap`, so the 14px "Update personal schedule" label would have overflowed. This matches the existing convention at `DefaultNotification.tsx:121` (`size="xl" className="xl:!size-[72px]"`). At 320px the column is ~184px against a ~148px label.
- **The `showExtras` prop is ignored by this card.** It is `false` in the 480px header popover (`NotificationPopover.tsx:57`), where the badge still renders at 72px on a wide viewport because the breakpoint keys off the viewport, not the panel. The panel has no height cap and fetches only 3 items, so this was accepted; revisit if the popover grows.
- **Deep-link trade-off:** after a Huber taps "Back to schedule", `?tab=timeslots` stays in the URL, so a refresh re-opens the editor. Accepted per plan; strip the param on close if it becomes annoying.
- **The deep-link only changes behaviour below `lg`.** At `lg`+ the `TimeSlotList` is already permanently visible (`my-schedule/page.tsx:174-176`), so there is nothing to open. The value of the param is mobile-only.
- `useSearchParams()` is used without a `Suspense` boundary, consistent with `/search` and `/reading`. Worth remembering that this opts the route into dynamic rendering.
- **No notification list/filter change was needed**, as planned: `src/app/[locale]/(auth)/notifications/page.tsx:28` only splits out `SESSION_REQUEST`, so this type lands in `otherNotifications` automatically. Verified by reading, not by running.
- The `hidden` `logo` node from the spec was intentionally not implemented.
- Still ahead in the flow: `pr` (`.ai/skills/create-pr.md`). `verify-ui` is not possible without a readable design image and a working dev server.
