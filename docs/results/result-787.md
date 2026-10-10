Result: feat: surface backend error detail in toasts (About page works save)

What changed
- `src/utils/apiError.ts` (new): pure `getApiErrorMessage(error)` — resolves a rejection to the backend's own wording (`data.errors` map / array / `fieldErrors` wrapper, then `data.message`, then a plain `error.message`), newline-joined one field per line and deduplicated. Returns `null` when there is no detail, so the caller supplies its own fallback. Exports `GENERIC_ERROR_KEY`, the `error_contact_admin` sentinel that `api.ts` throws.
- `src/utils/apiError.test.ts` (new): 12 Jest cases covering every accepted payload shape, the `errors`-over-`message` precedence, deduplication, the sentinel, and the unrecognized shapes.
- `src/libs/services/api.ts`: the re-thrown error keeps `message` and `status` unchanged and now also carries `.data` with the backend payload. 422 early-return, 304 → `{ data: null }`, and the 401 mutex / refresh / logout flow are untouched.
- `src/components/CustomToastifyContainer.tsx`: added `pushApiError(error, fallback)` — shows the extracted detail, or the caller's already-translated `fallback`, through the existing `pushError` (top-right, 5s, red `ErrorIcon`, bold `error occurred` title, `text-xs text-gray-500` body). The body div gained `whitespace-pre-line` so multi-field errors stack one per line.
- `src/features/users/hooks/useProfileActions.ts`: all four handlers (`handleSaveText`, `handleSaveLearningEntry`, `handleSaveWorkEntry`, `handleSaveTopics`) now call `pushApiError` through a shared `reportFailure` helper instead of showing a static `update_failed`.
- `src/features/users/components/profile/MyWorkSection.tsx`, `MyLearningPathSection.tsx`, `MyAboutSection.tsx`, `MyTopicsSection.tsx`: the inline editors now catch the save rejection, which stops the unhandled promise rejection and keeps the form/editor open on failure — previously that rejection escaped into RHF's `handleSubmit` while the toast was the only feedback.

Gates
- `npm run lint`: pass — 0 errors, 101 pre-existing warnings, none in the touched files.
- `npm run check:types`: pass.
- `npm run check:i18n`: pass — "No missing keys found!"; the reported unused/invalid keys are pre-existing. No locale file was modified, no new key was added.
- `npm run test`: pass — 4 suites, 32 tests. `apiError.ts` at 97% line coverage. An earlier run failed 6 of these cases and the extractor was corrected (a field map was being read as a single wrapper object); the gate was re-run once after the fix.
- `npm run test-storybook:ci`: not run locally — CI only (see `.ai/skills/implement-plan.md`).

Needs manual UI check
- `/[locale]/users/{ownId}?tab=about` — add a work entry with an empty **Company** and confirm the top-right toast reads `company should not be empty` (not `Update failed`) in both the add and the edit flow. The AI cannot drive the browser, so this is unverified.
- Same route — clear both **Company** and **Position** to confirm the two messages stack on separate lines, and that the inline form stays open.
- Same route, mobile width — confirm the multi-line body wraps and stays fully visible inside the fixed top-right toast.
- Same route — a bio / learning-path / topic save that fails should now show the backend wording and keep its editor open; success still shows `update_successfully`.

What was done

The About page's works save used to swallow the backend's answer. `api.ts` threw `new Error('error_contact_admin')` and discarded the response body for every status except 422, and `useProfileActions` caught without binding the error — so a 422 `{"errors":{"company":"company should not be empty"}}` reached the user as a bare "Update failed". There is now one extraction point (`getApiErrorMessage`), one toast wrapper (`pushApiError`), and the payload survives `api.ts`, so the four About-panel saves report what actually went wrong at the top right. Scoped deliberately to one place: the other ~70 `pushError` call sites are unchanged and stay listed as follow-up candidates in #787.

Notes / follow-up

- **Deviation from the plan, deliberate.** The plan said to drop the `throw new Error(...)` from the handlers and let the sections close on any resolve. Reading the call sites showed that all four sections keep their editor open *by relying on the rejection* (`await onSave?.(); setIsEditing(false)`), so dropping the throw would have closed the form on failure — a regression. The throw is kept and the four sections now catch it, which preserves the intended behavior and removes the unhandled promise rejection at the same time. This widened sub-task 5 from one file to five.
- **Backend error strings are English and untranslated.** A Vietnamese user sees an English field error inside a localized UI. Mapping backend codes to i18n keys is out of scope per the issue and is the most visible thing about this change.
- **This fixes reporting, not prevention.** `WorkEntryForm.tsx` still has no client-side validation, so the empty `company` still round-trips to the server and the form does not mark the offending input. A zod resolver on the work form is worth a follow-up issue.
- **`GENERIC_ERROR_KEY` is matched by string equality** against the literal at `api.ts:154`. There is no cycle-free import path between the two modules, so both sites carry a comment pointing at each other. If that literal is ever reworded, the extractor silently stops recognising it and detail would be suppressed instead of shown.
- **`error.message` was deliberately left as the i18n key** on the re-thrown error. ~70 call sites do `pushError(t(error.message))`; changing it would have made all of them print raw English. Attaching `.data` is purely additive.
- The multi-line body was implemented with `whitespace-pre-line` rather than a list of per-field divs as the plan described — same rendered result, no array-index keys, and it preserves newlines if a caller passes them directly. Line spacing and mobile wrapping were not specified and are unverified.
