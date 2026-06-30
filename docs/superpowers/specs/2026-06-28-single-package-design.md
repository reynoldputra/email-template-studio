# Single-Package Design for Email Template Studio

## Goal

Simplify product to one user-facing package: `email-template-studio`.

User should be able to:

1. Install one package
2. Run `init` to scaffold project files
3. Run `dev` to open local browser studio and edit MJML
4. Run `build` to compile templates
5. Run `validate` to check project structure and MJML

## Why Change

Current repo shape is heavier than product need:

- separate `apps/studio` package adds mental overhead
- separate `core` and `cli` package story complicates install and docs
- local testing already shows confusion around which package exposes CLI
- user does not care about internal package boundaries

Desired product shape is local-first and simple:

- one package to install
- one command surface
- one browser studio launched by `dev`
- one scaffold command to start project

## Product Requirements

### Required Commands

Package must expose these commands:

- `email-template-studio init`
- `email-template-studio dev`
- `email-template-studio build`
- `email-template-studio validate`

### Required `init` Output

`init` must generate:

- `package.json` if missing
- `email-template-studio.config.ts`
- `src/pages/`
- `src/components/`
- `src/styles/`
- `.env.example`
- one sample template
- sample reusable partials
- sample shared styles

### Required `dev` Behavior

`dev` is primary workflow.

It must:

- start one local server process
- serve browser studio UI from bundled assets
- expose local API for template list, preview, send, and validate
- watch project MJML files and reflect edits in browser flow
- resolve project root from current working directory by default

### Required `build` Behavior

It must:

- load project config
- discover templates from `src/pages`
- compile templates to HTML in output directory
- print per-template result and summary

### Required `validate` Behavior

It must:

- verify expected project structure
- verify template discoverability
- verify MJML compilation/parsing
- return non-zero exit code on errors

## Packaging Decision

Publish one user-facing package only:

- `email-template-studio`

Do not keep separate published packages for:

- `@email-template-studio/core`
- `@email-template-studio/cli`

Internal code may still be split by responsibility inside that package.

## Repository Design

Recommended repo target:

```text
packages/email-template-studio/
  package.json
  bin/
  src/
    cli/
    core/
    studio/
      client/
      server/
  static/
    studio/
examples/basic/
docs/
```

### Internal Boundaries

Inside single package:

- `src/core/` — template discovery, config loading, render, build, validate, send
- `src/cli/` — command parsing, terminal output, init flow, dev bootstrap
- `src/studio/client/` — browser UI
- `src/studio/server/` — HTTP handlers and static asset serving

This keeps user-facing packaging simple without collapsing code into one large module.

## Runtime Design

### `dev` Runtime

`dev` runs one Node process that:

1. resolves project root
2. starts HTTP server
3. serves bundled studio assets
4. handles API routes
5. watches source files as needed

Browser studio and API live in same package and same process.

### Browser UI Delivery

Studio client is bundled during package build and shipped as static assets.

At runtime, `dev` serves those files directly. User does not need Vite or separate app knowledge.

### Project Root Resolution

Default resolution order:

1. `EMAIL_TEMPLATE_STUDIO_PROJECT` env if set
2. current working directory if it looks like project root
3. explicit CLI flag later if added

For published product, no fallback to monorepo example project.

For repo development only, test helpers may still point to `examples/basic`.

## `init` Design

### Behavior

`init` scaffolds project in current working directory.

If files already exist:

- do not overwrite without explicit confirmation flag later
- print created vs skipped files clearly

### Generated Files

#### `package.json`

If missing, create minimal package file suitable for local authoring.

Must include at least:

- project name placeholder
- private flag
- scripts for `dev`, `build`, `validate`

#### `email-template-studio.config.ts`

Default config:

```ts
export default {
  pagesDir: 'src/pages',
  componentsDir: 'src/components',
  stylesDir: 'src/styles',
  outDir: 'dist',
};
```

#### Sample content

Create:

- `src/pages/welcome.mjml`
- `src/components/header.mjml`
- `src/components/footer.mjml`
- `src/styles/base.mjml`
- `.env.example`

Sample content must stay generic and public-safe.

## API Design for Studio

Internal HTTP API can stay close to current shape:

- `GET /api/templates`
- `POST /api/preview`
- `POST /api/send`
- `GET /api/validate`

This API is internal to dev server, not product surface promise. It can evolve as needed.

## Library API Decision

Package should still export small programmatic API from same package.

Supported exports should stay narrow:

- `loadConfig`
- `discoverTemplates`
- `renderPreview`
- `buildAllTemplates`
- `validateTemplateProject`
- `sendTestEmail`

This keeps future reuse possible without forcing multi-package story.

## Migration Plan

### Phase 1 — New package shell

Create `packages/email-template-studio` with:

- package manifest
- CLI bin
- source folders for `cli`, `core`, `studio`

### Phase 2 — Move current logic

Move code from:

- `packages/core` → `packages/email-template-studio/src/core`
- `packages/cli` → `packages/email-template-studio/src/cli`
- `apps/studio/server` → `packages/email-template-studio/src/studio/server`
- `apps/studio/src` → `packages/email-template-studio/src/studio/client`

Keep behavior same during move.

### Phase 3 — Bundle studio assets

Set package build to produce static studio assets shipped with package.

`dev` must serve built client assets from package output.

### Phase 4 — Add `init`

Implement project scaffolding with generic sample content.

### Phase 5 — Update docs and tests

Update:

- `README.md`
- `docs/GUIDE.md`
- contributor docs
- install instructions
- local testing instructions

Replace monorepo-oriented user guidance with single-package flow.

### Phase 6 — Delete old structure

After parity achieved, remove:

- `apps/studio`
- `packages/core`
- `packages/cli`

## Testing Strategy

### Unit

Keep unit coverage for:

- config resolution
- template discovery
- variable extraction
- preview render
- build output
- validation
- CLI arg parsing
- init file generation

### Integration

Add integration coverage for:

- `init` on empty directory
- `build` against generated sample project
- `validate` against valid and invalid projects
- `dev` server route responses

### Browser

Keep browser-level tests for studio UX, but run them against bundled single-package dev server.

### Smoke

Minimum repo smoke commands after migration:

```bash
pnpm test
pnpm build
```

Optional browser smoke remains acceptable if cost stays reasonable.

## Risks

### Build complexity moves, not disappears

Removing extra packages simplifies user story, but asset bundling still exists internally.

Mitigation: keep client/server/core folders separate inside package.

### `dev` startup can become fragile

Serving bundled assets and API from one process can blur concerns.

Mitigation: keep explicit server module boundaries and integration tests.

### `init` can overwrite user files

Mitigation: safe defaults, skip existing files, add explicit overwrite mode later.

### Programmatic API may drift

Mitigation: keep small supported export surface and test it.

## Non-Goals

- no hosted SaaS mode
- no plugin architecture
- no multi-package install story for end users
- no framework-specific integrations in this migration
- no attempt to preserve old package names as primary path

## Recommendation

Adopt single published package with internal folder boundaries.

This gives:

- simpler install story
- simpler docs
- simpler mental model
- preserved studio UX via `dev`
- enough structure to keep code maintainable

## Success Criteria

Project is successful when:

1. new user installs one package only
2. `init` creates working sample project
3. `dev` opens browser studio with no knowledge of internal apps/packages
4. `build` and `validate` work from scaffolded project
5. docs no longer describe multi-package setup for end users
