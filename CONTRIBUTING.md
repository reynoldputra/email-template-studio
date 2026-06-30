# Contributing

## Setup

```bash
git clone https://github.com/<you>/email-template-studio.git
cd email-template-studio
npm install
npm test
```

## Repo shape

```text
.studio/src/core/           — engine: config, discovery, render, build, validate, send, variables
.studio/src/cli/            — CLI commands (dev, build, validate) and arg parser
.studio/src/studio/client/  — React UI (Vite)
.studio/src/studio/server/  — Express API routes
src/                        — reference user templates (pages, components, styles)
```

## Rules

- Write tests next to source as `*.test.ts` or `*.test.tsx`
- Keep CLI thin — put reusable logic in `.studio/src/core/`
- Keep `src/` templates generic and public-safe
- Verify browser flows with `npm run test:e2e` when UI behaviour changes

## Rebuilding studio client

React UI is pre-built and committed in `.studio/static/studio/`. Only rebuild when you change files in `.studio/src/studio/client/`:

```bash
npm run build:studio
git add .studio/static/
git commit -m "chore: rebuild studio client assets"
```
