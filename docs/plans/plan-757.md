# Plan: feat: add timeSlotReminder notification card

Issue: #757
Branch: feat/757-timeslot-reminder-notification-card

## Sub-tasks

| # | Sub-task | Done condition |
| ----- | -------- | -------------- |
| 1 | Add `TIMESLOT_REMINDER = 'timeSlotReminder'` to `src/components/notification/private/types.ts`, and add `time_slot_reminder_message` + `time_slot_reminder_cta` under `"notifications"` in BOTH `src/locales/en.json` and `src/locales/vi.json` | `npm run check:i18n` passes; the only remaining `npm run check:types` errors are the two expected "missing property" errors in `private/config.tsx` and `private/registry.tsx` |
| 2 | Add the `notificationConfig` entry (`getMessage` + `route`) in `src/components/notification/private/config.tsx` and the `notificationRegistry` entry in `src/components/notification/private/registry.tsx`, card initially `DefaultNotificationCard` | `npm run check:types` is clean and a `timeSlotReminder` item renders as an ordinary card (this restores the build, which the enum addition alone breaks) |
| 3 | Create `src/components/notification/styles/TimeSlotReminderNotification.tsx`: plain-div icon wrapper (`size-[72px]` holding `<CalendarPlus className="text-primary-60" weight="fill" />`), message, CTA pill (`h-8 w-full rounded-full border border-primary-50 bg-primary-50 px-3 text-sm text-primary-98`), `leaf.svg` unseen slot | Card matches the Figma spec transcribed in issue #757: 72px icon, 120px card, 32px pill CTA — **needs manual browser check** (no design image available at plan time) |
| 4 | Make the card root a `<div>`, not a `<button>`; only the CTA `Button` calls the passed `onClick()` then `router.push(cfg.route(...))`. Do **not** call `useNotificationActions` again — `NotificationItemRenderer.tsx:34` already marks seen | Clicking the card body is a no-op; clicking the button marks the notification seen and navigates |
| 5 | Role-aware deep-link: `cfg.route` branches on `roleId` (mirroring `ACCOUNT_UPGRADE`, `config.tsx:34`) — `Role.LIBER` → `/my-schedule`, `Role.HUBER` → `/my-schedule?tab=timeslots`. In `src/app/[locale]/(auth)/my-schedule/page.tsx`, seed the existing `showMobileTimeslotRegistration` state from `useSearchParams().get('tab') === 'timeslots'` (mirroring `src/features/users/hooks/useProfileTab.ts:19`) | A Huber lands with the timeslot editor open; a Liber lands on the calendar view |
| 6 | Responsive pass across `sm` / `md` / `lg` / `xl` (1280px) / `xxl` / `3xl` (there is no `xs`), plus the 480px header popover at `src/layouts/webapp/NotificationPopover.tsx:57` | At 320px the badge and CTA both fit and the button label neither wraps nor truncates; the card degrades acceptably in the popover |
| 7 | Run the pre-PR gates and write the result doc | `npm run lint`, `npm run check:types`, `npm run check:i18n`, `npm run test` all pass, and `docs/results/result-757.md` is written |

## Decisions / risks

- **No design image available at plan time.** The spec text in issue #757 was the only ground truth, so sub-task 3's done-condition is a code-level check against the spec's box arithmetic and needs a manual browser check by the developer. Must be flagged on the PR.
- **Button primitive already matches the spec.** `variant="fill"` gives `bg-primary-50` (`#0442BF`), `size="sm"` gives `h-8` (32px) and `text-sm` (14px), and `rounded-full` + `font-medium` are baked into the common styles. Only the 1px same-colour border must be added. Never pass a `hover:` utility in `className` — it suppresses the built-in hover overlay (`Button.tsx:42`).
- **Badge must not reuse `Avatar`.** `Avatar` has no 72px size (hence the existing `xl:!size-[72px]` hack) and without an `imageUrl` it renders a generated identicon. A plain `<div>` follows the precedent in `SystemNotification.tsx:38`.
- **Icon convention.** `CalendarPlus` ships in `@phosphor-icons/react` (a regular dependency) and is currently unused; `CalendarDot` / `CalendarDots` are the established repo convention. No calendar SVG exists in `public/assets/icons/`, so no new asset is needed.
- **Deep-link trade-off.** After a Huber dismisses the sheet via "Back to schedule", the `?tab=timeslots` param remains in the URL, so a refresh re-opens it. Accepted unless the param is stripped on close (one extra effect).
- **Deep-link is mobile-only in practice.** At `lg`+ the `TimeSlotList` is always visible (`my-schedule/page.tsx:174-176`), so the Huber param only changes behaviour below `lg`. No `Suspense` wrapper is needed for `useSearchParams` — `/search` and `/reading` already use it bare.
- **`showExtras` is ignored by this card.** The badge is 72px everywhere. The popover is 480px vs the 662px spec, has no height cap, and fetches only 3 items.
- **Mark-as-seen fires on CTA click only**, so the unread leaf persists until the user acts on the CTA. This matches the design, which makes only the button interactive.
- **No Storybook story.** `src/components/notification/` has zero stories, and `.storybook/preview.tsx` provides neither `NextIntlClientProvider` nor a Redux `Provider`, so a story for this card would crash. Verified via the gates and a manual look instead.
- **`config.route` signature is inconsistent.** It is declared `(relatedEntityId: number, roleId?: number)`, but `OTHER` and `SESSION_COMPLETION` implement `(url: string | number) => string`. Follow the declared signature for this entry.
- **`relatedEntity` is typed `any`**, so field access carries no type risk. This entry uses no `relatedEntity` field at all — the message is a fixed string with no interpolation.
- **Enum + map coupling.** `notificationConfig` and `notificationRegistry` are exhaustive `Record<NotificationType, …>`, so sub-tasks 1 and 2 must land together or `npm run check:types` fails. `next.config.mjs` sets `ignoreBuildErrors: true`, so a broken type would otherwise ship silently.
- **Unchanged by design:** the notifications page (`src/app/[locale]/(auth)/notifications/page.tsx`) needs no edit — only `SESSION_REQUEST` is split into its own group, so this type lands in `otherNotifications` automatically. The `hidden` `logo` node from the spec is not implemented.
