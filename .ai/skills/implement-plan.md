# Skill: implement-plan

Trigger keyword: `implement`
Args: plan=docs/plans/plan-<issue>.md

This is step 2 of the FE AI flow. Runs after `plan` (step 1) wrote `docs/plans/plan-<issue>.md` and created the branch.

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 create-pr

## Steps

1. Read the plan file and the issue's written `UI reference` description. There is no design folder in the repo — work from the spec text. If a design image was shared in chat or at a local path and can be read, read it for guidance, but never copy or commit it.
2. Implement sub-task by sub-task, in order. One commit per sub-task only; message per the commit convention `fix:` / `feat:` / `refactor:` / `chore:` etc., always carrying the issue reference (`#<issue>`), e.g. `feat: add cover preview (#412)`. Never bundle multiple sub-tasks into one commit.
3. For every sub-task that changes UI, do a **code-level** check against the spec values in the plan (dimensions, color tokens, type scale, i18n keys, breakpoints) and note anything you could not confirm.
4. **Verification is once, at the end — not per sub-task.** See the "Local verification rules" section below: commit each sub-task with `--no-verify`, and run the checks a single time before the final commit. Never run `npm run check:types`, `npm run lint`, or any other gate more than once for the whole task.
5. Before finishing, run the full gates:
   - `npm run lint`
   - `npm run check:types`
   - `npm run check:i18n` (if locale keys changed)
   - `npm run test` (if logic or tests changed)
   - `npm run test-storybook:ci` (**CI only — do not run this locally**, see the rules below)
   Fix anything that fails in a follow-up commit. If a gate cannot run, say so explicitly and record it — never mark it as passing.
6. Write `docs/results/result-<issue>.md` (format below, NOT directly under `docs/`).
7. Tell the user: implementation done, result saved at `docs/results/result-<issue>.md`, and which parts need a manual browser check.

## Local verification rules

These two rules override the "AI flow (FE)" commit rule in `AGENTS.md` that forbids `--no-verify`. The user set them explicitly; they are a speed preference, not an oversight.

**1. Never run the Storybook test-runner locally.**

`npm run test-storybook:ci` drives `@storybook/test-runner`, which launches a headless browser through Playwright. Do not run it, and do not run `npx playwright install` to make it work — the browser download alone exceeds any reasonable local turnaround. It stays a CI-only gate.

- Story files are still **written and committed**; they are verified by CI, not locally.
- When reporting gates, write `test-storybook:ci: not run locally — CI only (see .ai/skills/implement-plan.md)`. Never mark it as passing.
- The same applies to anything else that needs a downloaded browser.

**2. Commit with `--no-verify` and verify once, at the end.**

The pre-commit hook runs `eslint --fix` + `npm run check:types` on every commit. On a large branch that is minutes per commit and blocks all other work.

- Every sub-task commit uses `git commit --no-verify`.
- Run `npm run lint` / `npm run check:types` (and `check:i18n` / `test` when relevant) **once**, after the last sub-task is committed.
- The **final** commit of the task is made **without** `--no-verify`, so the real hook runs on it.
- Never run the same gate twice. If `npm run check:types` already passed after the last sub-task, do not run it again before the final commit — just commit. Track which gates have run so nothing is repeated.
- If a gate fails, fix it and commit that fix with `--no-verify`, then re-run **only** the gate that failed, once.

## Merge commits and commitlint

CI runs `commitlint` over every commit in the branch, and `commitlint.config.ts` ignores only subjects starting with `Merge ` (capital M, space — Git's own convention). Anything else must be a valid Conventional Commit.

- A subject like `merge: resolve develop into <branch> (#779)` **fails CI** with `type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]`. Use `chore: merge develop into <branch> (#779)`.
- `merge`, `Merge branch`, and `merge:` are all invalid or ignored differently — verify with `npx commitlint` before pushing a merge.
- **Check the branch before amending.** `git branch --show-current` first. Amending while on `develop` rewrites `develop`'s history, not the feature branch's. Recover with `git reset --hard origin/develop`.
- After amending a merge commit, push with `git push --force-with-lease`.
- If a rename on this branch collides with an edit `develop` made to the same file, keep **develop's content at this branch's new path**, and verify the merged body really matches develop's version (normalise line endings before diffing — a CRLF/LF mismatch makes identical files look wholly different).

## Output format (docs/results/result-<issue>.md)

```
Result: <issue title>

What changed
<file>: <short description>
<file>: <short description>

Gates
- <gate>: <pass | could not run — why | not applicable>
- <any gate that could not run must be stated, never implied to pass>

Needs manual UI check
- <route + what to confirm in a browser, or "none">

What was done

<short summary, plain language>

Notes / follow-up
<anything left, anything to check manually>
```
