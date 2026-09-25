# HuLib - Powered by Boilerplate and Starter for Next JS 14+, Tailwind CSS 3.4 and TypeScript

<p align="center">
  <a href="https://creativedesignsguru.com/demo/Nextjs-Boilerplate/"><img height="300" src="public/assets/images/nextjs-starter-banner.png?raw=true" alt="Next js starter banner"></a>
</p>

🚀 Boilerplate and Starter for Next.js with App Router support, Tailwind CSS and TypeScript ⚡️ Made with developer experience first: Next.js, TypeScript, ESLint, Prettier, Husky, Lint-Staged, Jest, Testing Library, Commitlint, VSCode, Netlify, PostCSS, Tailwind CSS, Authentication with [Clerk](https://clerk.com?utm_source=github&utm_medium=sponsorship&utm_campaign=nextjs-boilerplate), Database with DrizzleORM (SQLite, PostgreSQL, and MySQL) and [Turso](https://turso.tech/?utm_source=nextjsstarterbp), Error Monitoring with [Sentry](https://sentry.io), Monitoring as Code with [Checkly](https://www.checklyhq.com), Storybook, Multi-language (i18n), and more

Clone this project and use it to create your own [Next.js](https://nextjs.org) project.

### Features

Developer experience first, extremely flexible code structure and only keep what you need:

- ⚡ [Next.js](https://nextjs.org) with App Router support
- 🔥 Type checking [TypeScript](https://www.typescriptlang.org)
- 💎 Integrate with [Tailwind CSS](https://tailwindcss.com)
- ✅ Strict Mode for TypeScript and React 18
- 🌐 Multi-language (i18n) with [next-intl](https://next-intl-docs.vercel.app/) and [Crowdin](https://l.crowdin.com/next-js)
- ♻️ Type-safe environment variables with T3 Env
- ⌨️ Form with React Hook From
- 🔴 Validation library with Zod
- 📏 Linter with [ESLint](https://eslint.org) (default NextJS, NextJS Core Web Vitals, Tailwind CSS and Airbnb configuration)
- 💖 Code Formatter with [Prettier](https://prettier.io)
- 🦊 Husky for Git Hooks
- 🚫 Lint-staged for running linters on Git staged files
- 🚓 Lint git commit with Commitlint
- 📓 Write standard compliant commit messages with Commitizen
- 🦺 Unit Testing with Jest and React Testing Library (pending)
- 🧪 Integration and E2E Testing with Playwright (pending)
- 👷 Run tests on pull request with GitHub Actions (pending)
- 🎉 Storybook for UI development (pending)
- 🚨 Error Monitoring with [Sentry](https://sentry.io) (Spotlightjs) (pending)
- ☂️ Code coverage with [Codecov](https://codecov.io) (pending)
- 📝 Logging with Pino.js and Log Management with [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate)
- 🖥️ Monitoring as Code with [Checkly](https://www.checklyhq.com) (pending)
- 🎁 Automatic changelog generation with Semantic Release
- 🔍 Visual testing with Percy (Optional)
- 💡 Absolute Imports using `@` prefix
- 🗂 VSCode configuration: Debug, Settings, Tasks and extension for PostCSS, ESLint, Prettier, TypeScript, Jest
- 🤖 SEO metadata, JSON-LD and Open Graph tags with Next SEO
- 🗺️ Sitemap.xml and robots.txt
- ⚙️ [Bundler Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- 🖱️ One click deployment with Netlify (or manual deployment to any hosting services)
- 💯 Maximize lighthouse score

Built-in feature from Next.js:

- ☕ Minify HTML & CSS
- 💨 Live reload
- ✅ Cache busting

### Philosophy

- Nothing is hidden from you, so you have the freedom to make the necessary adjustments to fit your needs and preferences.
- Easy to customize
- Minimal code
- SEO-friendly
- 🚀 Production-ready

### Requirements

- Node.js 18+ and npm

### Getting started

Run the following command on your local environment:

```shell
npm install
```

Then, you can run locally in development mode with live reload:

```shell
npm run dev
```

Open http://localhost:3000 with your favorite browser to see your project.

### Translation (i18n) setup

For translation, the project uses `next-intl` combined with [Crowdin](https://l.crowdin.com/next-js). As a developer, you only need to take care of the English (or another default language) version. Other languages are automatically generated and handled by Crowdin. You can use Crowdin to collaborate with your translation team or translate the messages yourself with the help of machine translation.

To set up translation (i18n), create an account at [Crowdin.com](https://l.crowdin.com/next-js) and create a new project. In the newly created project, you will able to find the project ID. You'll also require to create a new Personal Access Tokens by going to Account Settings > API. Then, in your GitHub Actions, you need to define the following environment variables `CROWDIN_PROJECT_ID` and `CROWDIN_PERSONAL_TOKEN`.

After defining the environment variables in your GitHub Actions, your localization files will be synchronized with Crowdin everytime you push a new commit to the `main` branch.

### Project structure

```shell
.
├── README.md                       # README file
├── .github                         # GitHub folder
├── .husky                          # Husky configuration
├── .storybook                      # Storybook folder
├── .vscode                         # VSCode configuration
├── migrations                      # Database migrations
├── public                          # Public assets folder
├── scripts                         # Scripts folder
├── src
│   ├── app                         # Next JS App (App Router)
│   ├── components                  # React components
│   ├── libs                        # 3rd party libraries configuration
│   ├── locales                     # Locales folder (i18n messages)
│   ├── models                      # Database models
│   ├── styles                      # Styles folder
│   ├── templates                   # Templates folder
│   ├── types                       # Type definitions
│   ├── utils                       # Utilities folder
│   └── validations                 # Validation schemas
├── tests
│   ├── e2e                         # E2E tests, also includes Monitoring as Code
│   └── integration                 # Integration tests
├── tailwind.config.ts              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

### Customization

You can easily configure this Next js Boilerplate by making a search in the whole project with `FIXME:` for making quick customization. Here is some of the most important files to customize:

- `public/apple-touch-icon.png`, `public/favicon.ico`, `public/favicon-16x16.png` and `public/favicon-32x32.png`: your website favicon, you can generate from https://favicon.io/favicon-converter/
- `src/utils/AppConfig.ts`: configuration file
- `src/templates/BaseTemplate.tsx`: default theme
- `.env`: default environment variables

You have access to the whole code source if you need further customization. The provided code is only example for you to start your project. The sky is the limit 🚀.

### Commit Message Format

The project enforces [Conventional Commits](https://www.conventionalcommits.org/) specification. This means that all your commit messages must be formatted according to the specification. To help you write commit messages, the project uses [Commitizen](https://github.com/commitizen/cz-cli), an interactive CLI that guides you through the commit process. To use it, run the following command:

```shell
npm run commit
```

One of the benefits of using Conventional Commits is that it allows us to automatically generate a `CHANGELOG` file. It also allows us to automatically determine the next version number based on the types of commits that are included in a release.

### AI-First Workflow

Feature work on this repo is driven by an AI-first flow (same as `hulib-services`). The AI agent (default: `opencode`, recorded in `.ai/models.md`) is triggered by keywords in the request and follows the skill files under `.ai/skills/`.

**Flow order:**

| Step | Trigger | Skill | Output |
| ---- | ------- | ----- | ------ |
| 0 | `brainstorm-issue` / `new-task` | `.ai/skills/write-issue.md` | GitHub issue (with optional `design=` UI screenshots) |
| 1 | `plan issue=<n>` | `.ai/skills/pull-and-plan.md` | Branch from `develop` + `docs/plans/plan-<issue>.md` |
| 2 | `implement plan=...` | `.ai/skills/implement-plan.md` | Code, one commit per sub-task + `docs/results/result-<issue>.md` |
| 3 | `verify issue=<n>` (optional) | `.ai/skills/verify-ui.md` | Screenshot proof vs design reference |
| 4 | `pr issue=<n>` | `.ai/skills/create-pr.md` | PR against `develop`, `Closes #<issue>` |

**Turning a UI design into a task:** paste the screenshot/photo path with `design=` (e.g. `brainstorm-issue background=... requirement=... design=./mockups/settings.png`). The image is stored in `.ai/references/<issue>/`, and `plan` / `implement` treat it as the ground truth the UI must match; the PR then shows design vs implemented side by side.

**Artifacts**

- Design screenshots & UI verify captures: `.ai/references/<issue>/`
- Plans: `docs/plans/plan-<issue>.md`
- Results: `docs/results/result-<issue>.md`

**Branch & commit rules for AI-flow work** (documented in `AGENTS.md`, not in a hook): work branches are `<type>/<issue>-<slug>` forked from `develop`; every commit message carries `#<issue>` and follows Conventional Commits (commitlint, see below). Lint/typecheck/i18n gates must pass before a PR.

### Testing

All unit tests are located with the source code inside the same directory. So, it makes it easier to find them. The project uses Jest and React Testing Library for unit testing. You can run the tests with:

```shell
npm run test
```

### Integration & E2E Testing

The project uses Playwright for Integration and E2E testing. You can run the tests with:

```shell
npx playwright install # Only for the first time in a new environment
npm run test:e2e
```

### Enable Edge runtime (optional)

The App Router folder is compatible with the Edge runtime. You can enable it by uncommenting the following lines `src/app/layouts.tsx`:

```tsx
// export const runtime = 'edge';
```

For your information, the database migration is not compatible with the Edge runtime. So, you need to disable the automatic migration in `src/libs/DB.ts`:

```tsx
if (process.env.NODE_ENV !== 'production') {
  await migrate(db, { migrationsFolder: './migrations' });
}
```

After disabling it, you are required to run the migration manually with:

```shell
npm run db:migrate
```

You also require to run the command each time you want to update the database schema.

### Deploy to production

You can generate a production build with:

```shell
$ npm run build
```

It generates an optimized production build of the boilerplate. For testing the generated build, you can run:

```shell
$ npm run start
```

The command starts a local server with the production build. Then, you can now open http://localhost:3000 with your favorite browser to see the project.

### Deploy to Netlify

Clone this repository on own GitHub account and deploy to Netlify in one click:

[![Netlify Deploy button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ixartz/Next-js-Boilerplate)

During the setup, you need to define the `DATABASE_URL` and `DATABASE_AUTH_TOKEN` environment variables.

### Error Monitoring

The project uses [Sentry](https://sentry.io) to monitor errors. For development environment, you don't need to do anything: NextJS Boilerplate is already configured to use Sentry and Spotlight (Sentry for Development). All errors will be automatically sent to your local Spotlight instance. So, you can try the Sentry experience locally.

For production environment, you need to create a Sentry account and create a new project. Then, in `next.config.mjs`, you need to update the `org` and `project` attribute in `withSentryConfig` function. You also need to add your Sentry DSN in `sentry.client.config.ts`, `sentry.edge.config.ts` and `sentry.server.config.ts`.

### Code coverage

NextJS Boilerplate relies on [Codecov](https://codecov.io) for code coverage reporting solution. To use Codecov, create a Codecov account and connect it to your GitHub account. On your Codecov dashboard, it should display a list of your repositories. Select the repository you want to enable Codecov for and copy the token. Then, in your GitHub Actions, you need to define the `CODECOV_TOKEN` environment variable and paste the token you copied.

Be sure to create the `CODECOV_TOKEN` as a Github Actions secret, do not paste it directly into your source code.

### Logging

The project uses Pino.js for logging. By default, for development environment, the logs are displayed in the console.

For production environment, the project is already integrated with [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) to manage and query your logs using SQL. To use Better Stack, you need to create a [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) account and create a new source: go to your Better Stack Logs Dashboard > Sources > Connect source. Then, you need to give a name to your source and select Node.js as the platform.

After creating the source, you able to see your source token and copy it. Then, in your environment variabless, you can paste the token in `LOGTAIL_SOURCE_TOKEN` variable. Now, all your logs will be automatically sent and ingested by Better Stack.

### Checkly monitoring

The project uses [Checkly](https://www.checklyhq.com) to ensure that your production environment is always up and running. At regular intervals, Checkly runs the tests ending with `*.check.spec.ts` extension and notifies you if any of the tests fail. Additionally, you have the flexibility to execute tests across multiple locations to ensure that your application is available worldwide.

To use Checkly, you must first create an account on [their website](https://www.checklyhq.com). Once you have an account, you can set the `CHECKLY_API_KEY` environment variable in GitHub Actions by generating a new API key in the Checkly Dashboard. Additionally, you will need to define the `CHECKLY_ACCOUNT_ID`, which can also be found in your Checkly Dashboard under User Settings > General.

To complete the setup, make sure to update the `checkly.config.ts` file with your own email address and production URL.

### Useful commands

#### Bundle Analyzer

NextJS Boilerplate comes with a built-in bundle analyzer. It can be used to analyze the size of your JavaScript bundles. To begin, run the following command:

```shell
npm run build-stats
```

By running the command, it'll automatically open a new browser window with the results.

### Known warnings

#### webpack.cache.PackFileCacheStrategy

Warning: webpack.cache.PackFileCacheStrategy Serializing big strings (104kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)

This warning is caused by using `Clerk` and `next-intl` middlewares. It only happens when both middlewares are used together.

### VSCode information (optional)

If you are VSCode users, you can have a better integration with VSCode by installing the suggested extension in `.vscode/extension.json`. The starter code comes up with Settings for a seamless integration with VSCode. The Debug configuration is also provided for frontend and backend debugging experience.

With the plugins installed on your VSCode, ESLint and Prettier can automatically fix the code and show you the errors. Same goes for testing, you can install VSCode Jest extension to automatically run your tests and it also show the code coverage in context.

Pro tips: if you need a project wide type checking with TypeScript, you can run a build with <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> on Mac.

### Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have question or found a bug. Totally open to any suggestions and improvements.

### License

Licensed under the MIT License, Copyright © 2023

See [LICENSE](LICENSE) for more information.

---

Made with ♥ by [CreativeDesignsGuru](https://creativedesignsguru.com)
