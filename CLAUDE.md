# CLAUDE.md

Guidance for Claude Code in this repo. Read before touching code.

## What This Is

Open-source MJML email template toolchain. `pnpm` workspace monorepo. Authors templates from MJML files, previews desktop/phone, extracts variables, validates, compiles to HTML, sends test SMTP. Migrated from internal repo — keep all examples and defaults generic, no company context.

## Layout

```
apps/studio/          # React + Vite UI, Express API server
  src/                # React app (App.tsx, hooks, components, api/client.ts)
  server/             # Express server, routes for templates/preview/send/validate
  e2e/                # Playwright specs
packages/core/        # Engine — config, fs discovery, variables, render, build, validate, send
packages/cli/         # `email-template-studio` CLI — dev/build/watch/send/validate
packages/components/  # Optional starter MJML blocks (private, not published V1)
examples/basic/       # Reference project — used by studio as default project root
docs/GUIDE.md         # Single merged doc: architecture, testing, security, roadmap, migration
docs/screenshots/     # README/GUIDE screenshots
```

User-facing docs:
- `README.md` — product overview, quick start, layout, features
- `CONTRIBUTING.md` — contributor workflow, conventions, commit format
- `docs/GUIDE.md` — full architecture / testing / security / roadmap / migration reference

## Package Boundaries (strict)

- `core` — no UI, no CLI process concerns, no framework lock-in. Pure FS-driven API.
- `cli` — wraps `core`, terminal IO only.
- `apps/studio` — consumes `core` via API routes. No compile logic duplicated.
- `components` — starter MJML, optional, treated as data not runtime dep.

Public package scope: `@email-template-studio/*`. `studio` reserved, not published in V1.

## Commands

```bash
pnpm install
pnpm dev:studio        # runs vite + express concurrently (3100 web, 3101 api)
pnpm test              # vitest run (packages + apps unit/integration)
pnpm test:e2e          # playwright
pnpm build             # pnpm -r build
pnpm typecheck
pnpm lint
pnpm format
```

CLI commands (via `packages/cli`): `dev`, `build`, `watch`, `send --to X --template Y`, `validate`.

## Conventions

- TypeScript ESM. `"type": "module"` everywhere. Import with `.js` extension even for `.ts` source (NodeNext).
- File naming: kebab-case `.ts` / `.tsx`. One responsibility per file.
- Tests live next to source as `*.test.ts(x)`. Fixtures under `packages/core/test/fixtures/`.
- Vitest aliases `@email-template-studio/core` → `packages/core/src/index.ts` (see `vitest.config.ts`).
- Studio resolves project root via `EMAIL_TEMPLATE_STUDIO_PROJECT` env or markers (`src/pages`, `email-template-studio.config.ts`); falls back to `examples/basic`.

## TDD Discipline

Plan is TDD: every task is `failing test → minimal impl → green → commit`. When extending:

1. Write failing test first.
2. Minimal implementation.
3. Run targeted vitest, then full `pnpm test`.
4. Commit per task with conventional message (`feat(core): ...`, `feat(cli): ...`).

Use `superpowers:test-driven-development` skill.

## Public-Safe Rules

From `docs/GUIDE.md` (Security + Migration sections):

- No company names, real domains, real recipients, internal variable names.
- Never commit `.env`. SMTP via env only.
- Examples must use neutral placeholders (`sender@example.com`, `Sample User`, etc.).
- Test SMTP via Ethereal or fake transport — never real provider in CI.

## Variable Convention

Template placeholders use `{{ expression }}`. `extractVariables` derives:
- `expression` — raw (`user.first_name`)
- `key` — normalized snake_case (`user_first_name`)
- `label` — Title Case (`User First Name`)
- `defaultValue` — `Sample <Label>`

`interpolateVariables(source, valuesByKey)` injects by normalized key.

## Core API Surface

Exports from `packages/core/src/index.ts`:
`loadConfig`, `discoverTemplates`, `extractVariables`, `interpolateVariables`, `renderPreview`, `buildAllTemplates`, `validateTemplateProject`, `sendTestEmail`. Types: `TemplateProjectConfig`, `TemplateDescriptor`, `TemplateVariable`, `BuildResult`, `TransportConfig`.

Keep this surface stable. Add new exports only when plan/spec calls for it.

## Studio API Routes

- `GET  /api/templates` → list
- `POST /api/preview` `{ templateId, values }` → `{ html }`
- `POST /api/send` `{ templateId, to, values }` → `{ messageId }`
- `GET  /api/validate` → result

## CI Gates

`.github/workflows/ci.yml`: install → lint → typecheck → test → build. PRs must pass all.

## Non-Goals (V1)

No hosted SaaS, no WYSIWYG editor, no multi-user backend, no ESP integrations, no analytics. Stay local-first, file-based.

## When Adding Features

1. Check `docs/GUIDE.md` (Roadmap + Non-Goals) — does it fit V1 scope?
2. Brainstorm via `superpowers:brainstorming` if user-facing.
3. Implement TDD task-by-task. Commit per task.
4. Update `docs/GUIDE.md`, `README.md`, or `CONTRIBUTING.md` if architecture, commands, or workflow change.
5. Add changeset for any `core`/`cli` public API change.
