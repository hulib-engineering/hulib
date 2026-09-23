# Skill: write-issue

Trigger keyword: `brainstorm-issue` / `new-task`
Args: background=, requirement=, design= (optional, comma-separated paths to UI screenshots/photos), title= (optional)

This is step 0 of the FE AI flow. It must finish before `plan` can run.

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 verify-ui (optional) → 4 create-pr

## Steps

1. Read `background` and `requirement` from user input. Read optional `design=` paths (screenshot/photo files showing the target UI look). Verify each design path exists; if any is missing, ask the user for the correct path before continuing.
2. Think product-first: who is it for, what problem is solved, what is the smallest useful version. Derive a Conventional Commits type (`feat` / `fix` / `refactor` / `docs` / `test` / `chore`) and a short action title.
3. Compose the issue body with the FE template below. Every requirement item that shows a visible string on screen must note the target screen/route so the i18n and component-scope steps are planned correctly.
4. Create the issue:
   - `gh issue create --title "<type>: <short description>" --body "<body without reference paths yet>"`
   - Capture the returned issue number N.
5. If `design=` was provided:
   - `mkdir -p .ai/references/<N>`
   - Copy each design file into `.ai/references/<N>/design-<NN><ext>` (keep original names if clear).
   - Re-render the body with the exact `UI reference` paths and run `gh issue edit <N> --body-file <final body file>`.
   - These screenshots are ground truth for `plan` and `implement`; they are committed on the branch and shown in the PR.
6. Output the issue number and URL to the user.

## Output format (issue body)

```
## Background
<2-4 sentences: why this is needed>

## Requirement
- <behavior, must be true when done>
- <where it lives, e.g. src/app/[locale]/<route> or src/components/<area>/*>

## UI reference
- `.ai/references/<N>/design-01.png` — expected look (read it before planning/implementing)

## Responsive
- <desktop / tablet / mobile — which Tailwind breakpoints must be checked>

## i18n
- <new/moved visible strings; keys must be added to BOTH src/locales/en.json and src/locales/vi.json>

## Out of scope
- <items>
```

If no `design=` was given, create a text-only issue; note in the body that the UI reference is still needed if the task changes visuals, so `plan` can flag it.
