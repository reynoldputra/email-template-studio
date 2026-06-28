# Email Template Studio — Full Guide

Single-document reference for users and contributors. For a high-level intro, see the [README](../README.md).

## Table of contents

- [Architecture](#architecture)
- [Testing](#testing)
- [Security](#security)
- [Roadmap](#roadmap)
- [Migration from an internal repo](#migration-from-an-internal-repo)

---

## Architecture

### Monorepo layout

```text
apps/studio/          React + Vite UI, Express API server
  src/                React app (App.tsx, hooks, components, api/client.ts)
  server/             Express server + route handlers
  e2e/                Playwright specs
packages/core/        Engine: config, fs discovery, variables, render, build, validate, send
packages/cli/         CLI: `email-template-studio` (dev/build/watch/send/validate)
packages/components/  Optional starter MJML blocks (private in V1)
examples/basic/       Reference project — used by the studio as its default target
docs/                 This guide and screenshots
```

### Package boundaries (strict)

- **`core`** — no UI, no CLI process concerns, no framework lock-in. Pure file-system-driven library.
- **`cli`** — wraps `core`, terminal IO only.
- **`apps/studio`** — consumes `core` via HTTP API routes. Compile logic is never duplicated.
- **`components`** — starter MJML, treated as data not runtime dependency.

Public package scope: `@email-template-studio/*`. The `studio` app is reserved and not published in V1.

### Runtime flow

```text
   user
    │
    ▼
┌───────────────┐    HTTP    ┌────────────────┐    fn call    ┌──────────────┐
│  React (Vite) │ ─────────► │  Express (API) │ ─────────────►│     core     │
│  apps/studio  │            │  apps/studio   │               │  packages/   │
└───────────────┘            └────────────────┘               └──────────────┘
                                                                     │
                                                                     ▼
                                                              ┌──────────────┐
                                                              │  MJML +      │
                                                              │  nodemailer  │
                                                              └──────────────┘
```

### Studio HTTP API

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| `GET`  | `/api/templates` | — | `[{ id, name }]` |
| `POST` | `/api/preview` | `{ templateId, values }` | `{ html }` |
| `POST` | `/api/send` | `{ templateId, to, values }` | `{ messageId }` |
| `GET`  | `/api/validate` | — | `{ ok, errors? }` |

### Project root resolution

The studio's API server resolves the project root in this order:

1. `EMAIL_TEMPLATE_STUDIO_PROJECT` env (path relative to cwd)
2. Current working directory if `src/pages/` or `email-template-studio.config.ts` exists
3. Fallback to `examples/basic/` (only when running from the monorepo)

### TypeScript conventions

- `"type": "module"` everywhere
- Source `.ts`, but imports use `.js` extensions (NodeNext resolution)
- Vitest aliases `@email-template-studio/core` → `packages/core/src/index.ts` so tests run against source

---

## Testing

### Layers

- **Unit** — placeholder parsing, variable derivation, template discovery, config normalization, output paths
- **Integration** — compiling real fixtures with partials and shared styles, full build flows
- **E2E** — studio loads template list, preview re-renders on variable change, send flow succeeds and fails gracefully
- **SMTP send** — use [Ethereal](https://ethereal.email/) or a local fake SMTP; never a real provider in CI

### Commands

```bash
pnpm test          # unit + integration (Vitest)
pnpm test:watch    # Vitest in watch mode
pnpm test:e2e      # Playwright
pnpm build         # build every package — also a smoke gate
```

### Fixtures

`packages/core/test/fixtures/project-a/` contains a minimal MJML project used by core's tests. Add new fixtures alongside it; don't reach into `examples/basic/` from unit tests.

### CI gates

Every pull request runs:

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm build`

See `.github/workflows/ci.yml`. The release workflow (`.github/workflows/release.yml`) publishes packages via Changesets on dispatch.

---

## Security

### Secret handling

- **Never commit `.env`**. It's in `.gitignore`; keep it that way.
- SMTP credentials live in env vars only, loaded by the CLI's `send` command and the studio's `/api/send` route.
- The `.env.example` files use placeholder values (`smtp.example.com`, etc.) and are safe to commit.

### Test sends

- Local development: use a fake SMTP server ([Ethereal](https://ethereal.email/), [MailHog](https://github.com/mailhog/MailHog), or [smtp4dev](https://github.com/rnwood/smtp4dev)).
- CI: must use a fake transport — never a real ESP. Real providers in CI cause rate-limit pain and accidental sends.

### Vulnerability disclosure

Please report security issues privately first. Open a GitHub Security Advisory or email the maintainers before filing a public issue. We'll coordinate a fix and disclosure timeline.

---

## Roadmap

Planned for post-V1 (no fixed dates):

- Stronger variable schema support (typed defaults, validation rules)
- Plain-text fallback generation alongside HTML
- Visual diff snapshots in PRs
- Component gallery view in the studio
- Accessibility checks for rendered HTML
- Optional Turbo for workspace orchestration once scale demands it

### Non-goals for V1

Out of scope on purpose — keep the surface area small:

- Hosted SaaS product
- Drag-and-drop / WYSIWYG editor
- Multi-user collaboration backend
- ESP-specific deployment integrations
- Production send pipelines or analytics

---

## Migration from an internal repo

If you're extracting templates from a closed-source repo to a public one (the studio was born this way), run through this checklist before pushing:

- Remove or replace **company and product names** in templates, docs, and comments
- Replace **internal sample data** (names, emails, addresses, IDs) with neutral placeholders (`user@example.com`, `Sample User`)
- Remove **internal domains** in links, sender addresses, and recipient lists
- Replace **branded templates** with generic equivalents
- Remove **screenshots** containing brand elements; regenerate with the public example project
- Audit **variable names** that reveal business context (e.g. `acme_account_tier` → `account_tier`)
- Strip **internal comments**, ticket numbers, and slack links from MJML and code
- Remove any **`.env`** files; ensure they're in `.gitignore`
- Replace **package.json metadata**: name, author, repository URL, keywords
- Verify **CI workflows** don't reference internal secrets or runners

Run `git log -p -- '*.mjml' '*.md'` and grep for company names before publishing.
