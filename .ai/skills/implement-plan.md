# Skill: implement-plan

Trigger keyword: `implement`
Args: plan=docs/plans/plan-<issue>.md

This is step 2 of the FE AI flow. Runs after `plan` (step 1) wrote `docs/plans/plan-<issue>.md` and created the branch.

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 create-pr

## Steps

1. Read the plan file and the issue's written `UI reference` description. There is no design folder in the repo — work from the spec text. If a design image was shared in chat or at a local path and can be read, read it for guidance, but never copy or commit it.
2. Implement sub-task by sub-task, in order. One commit per sub-task only; message per the commit convention `fix:` / `feat:` / `refactor:` / `chore:` etc., always carrying the issue reference (`#<issue>`), e.g. `feat: add cover preview (#412)`. Never bundle multiple sub-tasks into one commit and never use `--no-verify`.
3. For every sub-task that changes UI, do a **code-level** check against the spec values in the plan (dimensions, color tokens, type scale, i18n keys, breakpoints) and note anything you could not confirm.
4. Per sub-task verification: `npm run check:types` and `npm run lint`.
5. Before finishing, run the full gates:
   - `npm run lint`
   - `npm run check:types`
   - `npm run check:i18n` (if locale keys changed)
   - `npm run test` (if logic or tests changed)
   - `npm run test-storybook:ci` (if a Storybook story was added/changed and browsers are installed)
   Fix anything that fails in a follow-up commit. If a gate cannot run, say so explicitly and record it — never mark it as passing.
6. Write `docs/results/result-<issue>.md` (format below, NOT directly under `docs/`).
7. Tell the user: implementation done, result saved at `docs/results/result-<issue>.md`, and which parts need a manual browser check.

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
