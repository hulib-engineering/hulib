# Skill: create-pr

Trigger keyword: `pr` / `submit`
Args: issue=<number>

This is the final step of the FE AI flow. Runs after implement-plan wrote `docs/results/result-<issue>.md`.

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 create-pr

## Steps

1. Read `docs/plans/plan-<issue>.md` and `docs/results/result-<issue>.md`.
2. Do not attach screenshots. Design and verify images are not stored in the repo, so the PR body must instead **name the routes that need a manual browser check** and state which gates could not run.
3. Push the branch: `git push -u origin <current-branch>`.
4. Create the PR: `gh pr create --base develop --head <branch> --title "<type>: <short description>" --body-file <pr body temp file>` (PR title generally matches the issue title).
5. Make sure the body contains `Closes #<issue>` so the issue auto-closes on merge.
6. Output the PR URL to the user.

## Output format (PR body)

```
## Summary

### Feature

* What feature is implemented?
* What problem does it solve?
* What is the expected behavior?

### UI changes

* Describe the visual change in words (sizes, tokens, copy).
* List every route that needs a manual browser check, flagging auth-gated screens.
* State that visual verification is manual and was not performed by the AI.

### Changes

* [ ] Add / update page or component
* [ ] Reuse / extend a core primitive in `src/components/core`
* [ ] Add / update i18n keys (en + vi)
* [ ] Add / update Storybook story
* [ ] Add / update Jest / Playwright tests
* [ ] Other: <specify>

### Responsive

* Breakpoints addressed: <desktop / tablet / mobile>. Say "by code review only" if no browser check was possible.

### i18n

* Keys added/changed: <en.json + vi.json key list or "none">

### Testing

* Unit tests: <describe>
* Storybook tests: <describe>
* E2E/`npm run test:e2e`: <describe>
* Manual / visual: <required — list the routes and what to confirm in a browser>

### Notes

* Important implementation details
* Anything needing manual UI verification
* Dependencies / configuration changes

### Checklist

Leave a box unchecked and say why whenever a gate could not run. Never tick a gate that did not execute.

* [ ] `npm run lint` passes
* [ ] `npm run check:types` passes
* [ ] `npm run check:i18n` passes (if keys changed)
* [ ] Storybook story updated if component UI changed
* [ ] Manual browser check done by a developer
* [ ] No unrelated changes

Closes #<issue>
```
