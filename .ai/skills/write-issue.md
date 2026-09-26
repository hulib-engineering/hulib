# Skill: write-issue

Trigger keyword: `brainstorm-issue` / `new-task`
Args: background=, requirement=, design= (optional, comma-separated paths to UI screenshots/photos), title= (optional)

This is step 0 of the FE AI flow. It must finish before `plan` can run.

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 create-pr

## Steps

1. Read `background` and `requirement` from user input. If optional `design=` images were shared, read them now — but **never copy or commit them**. If a design path is given and cannot be read, say so plainly and continue from the written spec; the developer verifies visually later.
2. Think product-first: who is it for, what problem is solved, what is the smallest useful version. Derive a Conventional Commits type (`feat` / `fix` / `refactor` / `docs` / `test` / `chore`) and a short action title.
3. Compose the issue body with the FE template below. Every requirement item that shows a visible string on screen must note the target screen/route so the i18n and component-scope steps are planned correctly.
4. Create the issue:
   - `gh issue create --title "<type>: <short description>" --body "<body>"`
   - Capture the returned issue number N.
5. Output the issue number and URL to the user.

Design images are **not** stored in the repo. Keep any local copy in a gitignored folder such as `.ai/temp/`.

## Output format (issue body)

```
## Background
<2-4 sentences: why this is needed>

## Requirement
- <behavior, must be true when done>
- <where it lives, e.g. src/app/[locale]/<route> or src/components/<area>/*>

## UI reference
- <describe the expected look in words, or "developer to confirm in browser">

## Responsive
- <desktop / tablet / mobile — which Tailwind breakpoints must be checked>

## i18n
- <new/moved visible strings; keys must be added to BOTH src/locales/en.json and src/locales/vi.json>

## Out of scope
- <items>
```

Always record the expected look in words. If `design=` was given and could be read, describe the measurable details (sizes, colors, spacing) so `plan` and `implement` can work from text. If it could not be read, say so in the `UI reference` section so the developer knows a visual check is still outstanding — never claim the design was seen.
