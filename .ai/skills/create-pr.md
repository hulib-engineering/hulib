# Skill: create-pr

Trigger keyword: `pr` / `submit`
Args: issue=<number>

This is step 4 of the FE AI flow. Runs after implement-plan wrote `docs/results/result-<issue>.md` (and optionally after verify-ui).

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 verify-ui (optional) → 4 create-pr

## Steps

1. Read `docs/plans/plan-<issue>.md` and `docs/results/result-<issue>.md`.
2. Collect screenshot pairs under `.ai/references/<issue>/` — `design-*.png` (expected) vs `verify-*.png` (implemented). They are committed on the branch, so reference them with relative markdown paths in the PR body.
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

* ![design](.ai/references/<issue>/design-01.png) — expected
* ![implemented](.ai/references/<issue>/verify-01.png) — implemented
* List any route that needs manual checking (auth-gated screens).

### Changes

* [ ] Add / update page or component
* [ ] Reuse / extend a core primitive in `src/components/core`
* [ ] Add / update i18n keys (en + vi)
* [ ] Add / update Storybook story
* [ ] Add / update Jest / Playwright tests
* [ ] Other: <specify>

### Responsive

* Breakpoints verified: <desktop / tablet / mobile>

### i18n

* Keys added/changed: <en.json + vi.json key list or "none">

### Testing

* Unit tests: <describe>
* Storybook tests: <describe>
* E2E/`npm run test:e2e`: <describe>
* Manual / visual: <describe — reference the verify-*.png captures>

### Notes

* Important implementation details
* Anything needing manual UI verification
* Dependencies / configuration changes

### Checklist

* [ ] `npm run lint` passes
* [ ] `npm run check:types` passes
* [ ] `npm run check:i18n` passes (if keys changed)
* [ ] Storybook story updated if component UI changed
* [ ] Screenshots attached under UI changes
* [ ] No unrelated changes

Closes #<issue>
```
