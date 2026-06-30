# Repo Notes

Public-safe MJML email template toolchain. Repo-based project (not published to npm).

## Layout

- `.studio/src/core/` — engine: config, discovery, render, build, validate, send
- `.studio/src/cli/` — CLI commands: `dev`, `build`, `validate`
- `.studio/src/studio/client/` — React UI
- `.studio/src/studio/server/` — Express server + routes
- `.studio/static/studio/` — built studio assets
- `src/` — reference template project (pages, components, styles)
- `docs/GUIDE.md` — architecture, testing, security

## Commands

```bash
npm install
npm test
npm run build
npm run test:e2e
```

## Conventions

- TypeScript ESM with `.js` import extensions
- Tests live next to source
- SMTP via env only
- Keep `src/` templates generic and public-safe
