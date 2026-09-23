# Skill: pull-and-plan

Trigger keyword: `plan`
Args: issue=<number>

This is step 1 of the FE AI flow. Requires the issue from write-issue (step 0). Must not run before an issue exists.

AI flow (FE): 0 write-issue → 1 pull-and-plan → 2 implement-plan → 3 verify-ui (optional) → 4 create-pr

## Steps

1. Pull the issue: `gh issue view <issue> --json number,title,body`.
2. Look for design references at `.ai/references/<issue>/`. Read every image — it is the ground truth for UI sub-tasks. If the issue says the UI changes but no reference exists, flag it as a risk and ask the user for the design image before proceeding.
3. Break the requirement into ordered sub-tasks, each small, testable, with a clear done-condition. FE-specific guidance for each sub-task:
   - **Route/component mapping**: which page under `src/app/[locale]/`, which components to touch, and which `src/components/core/*` primitives to reuse before writing custom DOM/styling.
   - **i18n**: every new or moved visible string must be added as a key to `src/locales/en.json` AND `src/locales/vi.json` (they must stay in sync; `npm run check:i18n` enforces it).
   - **Visual acceptance**: for UI sub-tasks, the done-condition is "renders like `.ai/references/<issue>/design-XX`" (verified via verify-ui).
   - **Responsive**: note the Tailwind breakpoints from `tailwind.config.ts` (`screens`) the change must honor.
   - **Tests**: Jest for logic (`npm run test`); a Storybook story (`src/**/*.stories.tsx`) for new/reused presentational components; Playwright only where a meaningful flow exists.
   - **Verification per sub-task**: `npm run check:types` and `npm run lint`; `npm run check:i18n` once keys change.
4. Order sub-tasks dependencies-first (data/model before view; i18n keys before a story that renders them; core primitive before the page that uses it).
5. Derive the branch name from the issue title: `<type>/<issue>-<kebab-slug>`, forked from `develop`.
6. Present the proposed plan (sub-tasks + branch name) to the user and STOP. Do not create the branch or write files yet.
7. Only after confirmation: `git fetch origin develop && git checkout -b <branch> origin/develop`.
8. Write the plan file to `docs/plans/plan-<issue>.md` (NOT directly under `docs/`).
9. Output the plan file path and branch name.

## Output to user (ask before writing the file)

```
Plan for #<issue>
<issue title>

Branch to create (forked from develop):
<type>/<issue>-<kebab-slug>

Sub-tasks to confirm (in order):
1. <sub-task> — done when: <condition>
2. <sub-task> — done when: <condition>

Decisions / risks:
- <item>
- <item>

Confirm to create branch and write docs/plans/plan-<issue>.md
```

## Output format (docs/plans/plan-<issue>.md)

```
# Plan: <issue title>

Issue: #<issue>
Branch: <type>/<issue>-<kebab-slug>

## Sub-tasks

| # | Sub-task | Done condition |
| ----- | -------- | -------------- |
| 1 | <sub-task> | <condition> |
| 2 | <sub-task> | <condition> |

## Decisions / risks
- <item>
- <item>
```

Include in the done-condition the reference image path (e.g. "matches `.ai/references/<issue>/design-01.png`") for every visual sub-task.
