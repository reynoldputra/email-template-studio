# Email Template Studio — Full Guide

Single-document reference for users and contributors. For high-level intro, see [README](../README.md).

## Architecture

### Repo layout

```text
.studio/
  src/core/                      Engine: config, fs discovery, variables, render, build, validate, send
  src/cli/                       CLI command layer
  src/studio/client/             React UI
  src/studio/server/             Express server + route handlers
  static/studio/                 Built studio assets
src/                             Reference project at repo root
docs/                            Guide and screenshots
```

### Internal boundaries

- **`src/core`** — pure file-system-driven engine
- **`src/cli`** — terminal commands
- **`src/studio/client`** — browser UI
- **`src/studio/server`** — bundled local API + static serving

### Runtime flow

`email-template-studio dev` starts one Node process that:

1. resolves project root
2. serves bundled studio assets
3. exposes local API routes
4. renders previews and sends test emails through core engine

### Project root resolution

1. `EMAIL_TEMPLATE_STUDIO_PROJECT` env
2. current working directory if it has project markers
3. repo-only helpers should point at repo root

### TypeScript conventions

- `type: module` everywhere
- source imports use `.js` extensions
- Vitest runs tests from `.studio/src/**`

## Testing

### Layers

- **Unit** — placeholder parsing, variable derivation, template discovery, config normalization, output paths
- **Integration** — compiling real fixtures with partials and shared styles, build flows, template workspace flows
- **Browser** — bundled studio loads template list, preview re-renders on variable change
- **SMTP send** — use Ethereal or local fake SMTP; never real provider in CI

### Commands

```bash
npm test
npm build
npm test:e2e
```

### Fixtures

`.studio/src/core/**` tests use fixtures under `.studio/test/fixtures/`.

## Security

- Never commit `.env`
- Keep examples generic and public-safe
- Use fake SMTP in CI and local demos

## Roadmap

- Stabilize single-package workflow
- Improve template setup ergonomics
- Fold Playwright coverage fully into new package paths
