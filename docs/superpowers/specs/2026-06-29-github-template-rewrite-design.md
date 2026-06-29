# Design: GitHub Template Repo Rewrite

**Date:** 2026-06-29  
**Status:** Approved

## Goal

Convert email-template-studio from a publishable npm package into a GitHub template repository. People click "Use this template" on GitHub, clone, `npm install`, and get a working MJML email dev environment.

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Usage pattern | Clone & customize | Simplest. No install step. |
| Package manager | npm | Broadest familiarity, no extra setup. |
| Repo shape | Flat (no workspaces) | Single `package.json` at root. |
| Engine location | `.studio/` dotfolder | Hidden from casual view, still hackable. |
| CLI binary | Removed | Not a package, no `bin/` entry needed. |
| `init` command | Removed | GitHub "Use this template" replaces it. |

## Repo Structure

```
email-template-studio/
│
├── src/                          ← users edit this
│   ├── pages/
│   │   ├── welcome.mjml
│   │   ├── reset-password.mjml
│   │   ├── invoice.mjml
│   │   └── notification.mjml
│   ├── components/
│   │   ├── header.mjml
│   │   └── footer.mjml
│   └── styles/
│       └── base.mjml
│
├── .studio/                      ← engine source (users ignore)
│   └── src/
│       ├── core/                 ← config, discover, render, build, validate, send, variables
│       ├── cli/                  ← dev, build, validate commands + arg parser
│       └── studio/
│           ├── client/           ← React UI (Vite)
│           └── server/           ← Express API routes
│
├── dist/                         ← gitignored, compiled template output
├── email-template-studio.config.ts
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
├── CONTRIBUTING.md
└── docs/
    ├── GUIDE.md
    └── screenshots/
```

## package.json

```json
{
  "name": "email-template-studio",
  "private": true,
  "scripts": {
    "dev":          "ts-node .studio/src/cli/index.ts dev",
    "build":        "ts-node .studio/src/cli/index.ts build",
    "validate":     "ts-node .studio/src/cli/index.ts validate",
    "test":         "vitest run",
    "build:studio": "vite build"
  }
}
```

- `private: true` — not publishable
- No `main`, `exports`, or `bin` fields
- All deps as `devDependencies`
- `build:studio` kept for contributors testing studio client rebuild

## npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start studio server + file watcher |
| `npm run build` | Compile all templates to `dist/` |
| `npm run validate` | Check project structure + template syntax |
| `npm test` | Run unit tests |
| `npm run build:studio` | Rebuild React studio client (contributors only) |

## Source Migrations

| Current path | New path |
|---|---|
| `packages/email-template-studio/src/core/` | `.studio/src/core/` |
| `packages/email-template-studio/src/cli/` | `.studio/src/cli/` |
| `packages/email-template-studio/src/studio/` | `.studio/src/studio/` |
| `examples/basic/src/` | `src/` (root) |
| `examples/basic/email-template-studio.config.ts` | `email-template-studio.config.ts` (root) |
| `examples/basic/.env.example` | `.env.example` (root) |

## Files Removed

- `packages/` directory entirely
- `pnpm-workspace.yaml`
- `.npmrc`
- `.changeset/`
- `packages/email-template-studio/bin/`
- CLI `init` command (GitHub template replaces it)
- Programmatic API exports (`index.ts` public surface)

## Documentation Changes

### README.md — full rewrite
- Audience: people who just cloned the template
- Quick start: clone → `npm install` → `npm run dev`
- Layout section: explain `src/` (yours) vs `.studio/` (engine)
- Commands table
- Variables and SMTP sections
- Remove: npm install instructions, `pnpm exec`, programmatic API

### CONTRIBUTING.md — engine contributor guide
- How `.studio/` is organized
- When to run `build:studio`
- Running tests

### docs/GUIDE.md — update paths only
- `packages/email-template-studio/src/` → `.studio/src/`
- Everything else stays

## What Does NOT Change

- Engine logic (core, CLI commands, studio server, React UI)
- TypeScript + ESM conventions
- SMTP via env vars only
- Test colocated with source
- Vitest + Playwright for tests
