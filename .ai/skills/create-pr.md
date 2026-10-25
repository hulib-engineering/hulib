# Skill: create-pr

Trigger keyword: `pr` / `submit`
Args: issue=<number>

This is the final step of the FE AI flow. Runs after implement-plan wrote `docs/results/result-<issue>.md`.

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 create-pr

## Steps

1. Read `docs/plans/plan-<issue>.md` and `docs/results/result-<issue>.md`.
2. **Resolve conflicts against `develop` first**, if GitHub reports them. `git fetch origin develop && git merge origin/develop`.
   - Renames make these common: if this branch moved files that `develop` also edited, Git reports "deleted in one, modified in the other". Keep **develop's** content at **this branch's** path — verify the merged body matches develop's version (compare with line endings normalised) rather than assuming Git resolved it correctly.
   - **The merge commit message must pass commitlint.** `commitlint.config.ts` only ignores subjects starting with `Merge ` (capital M, space). A subject like `merge: resolve develop...` fails CI with `type must be one of [build, chore, ...]`. Use `chore: merge develop into <branch> (#<issue>)`.
   - Confirm you are on the **feature branch** before amending or committing. A merge-resolution `git commit --amend` on the wrong branch silently rewrites `develop`.
   - Push with `--force-with-lease` after amending a merge commit.
3. Do not attach screenshots. Design and verify images are not stored in the repo, so the PR body must instead **name the routes that need a manual browser check** and state which gates could not run.
4. Push the branch: `git push -u origin <current-branch>`.
5. Create the PR: `gh pr create --base develop --head <branch> --title "<type>: <short description>" --body-file <pr body temp file>` (PR title generally matches the issue title).
6. **Link the issue in the PR body — this is mandatory, not optional.** The body must contain the line `Closes #<issue>` as the final line. Omitting it leaves the issue open forever.
   - Use `gh pr create --body-file <file>` and confirm the line survived into the rendered body.
   - After creating, verify the link actually landed rather than assuming:
     `gh pr view <pr> --json body,closingIssuesReferences -q '.body | contains("Closes #<issue>")'`
     must print `true`.
   - **`closingIssuesReferences` will be empty when the PR targets `develop` rather than `main`.** GitHub only parses closing keywords for PRs aimed at the default branch, so `Closes #<issue>` will not auto-close anything here. Report this to the user explicitly instead of implying the issue is linked. See "Issue linkage" below.
7. Output the PR URL to the user.

## Issue linkage

The repo's default branch is `main`; PRs target `develop`. Consequences:

- `Closes #<issue>` in a `develop`-targeted PR is **inert** — GitHub does not auto-close and `closingIssuesReferences` stays empty.
- Keep the `Closes #<issue>` line anyway: it is the documented convention and becomes correct if the PR ever targets `main`, and it is visible to human reviewers.
- **Always tell the user the issue will not auto-close**, and offer: (a) closing #<issue> manually at merge time, or (b) adding `Part of #<issue>` so the issue's sidebar links back to the PR.
- Never report a PR as "linked to its issue" without checking `closingIssuesReferences`.

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

- [ ] `npm run lint` passes
- [ ] `npm run check:types` passes
- [ ] `npm run check:i18n` passes (if keys changed)
- [ ] Storybook story updated if component UI changed
- [ ] Manual browser check done by a developer
- [ ] No unrelated changes
- [ ] PR body ends with `Closes #<issue>` and `closingIssuesReferences` confirms it

Closes #<issue>
```
