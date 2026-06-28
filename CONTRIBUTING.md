# Contributing to Email Template Studio

Thanks for your interest in contributing! This project is open-source and we welcome bug reports, fixes, features, docs, and ideas. This guide walks you through everything you need to make your first contribution land smoothly.

## Code of Conduct

Be kind. Be respectful. Assume good intent. We follow the spirit of the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) — harassment, discrimination, or sustained personal attacks won't be tolerated. Report incidents privately to the maintainers.

## Ways to contribute

- 🐛 **Report a bug** — open an issue with a minimal reproduction
- 💡 **Propose a feature** — open a discussion or issue describing the use case before writing code
- 📝 **Improve docs** — typos, clarifications, examples; small PRs welcome
- 🔧 **Fix a bug** — pick one from the issue tracker, especially those labeled `good first issue`
- ✨ **Add a feature** — match the scope in [docs/GUIDE.md → Roadmap](docs/GUIDE.md#roadmap); coordinate first for anything larger than a small addition

## Getting set up

```bash
# 1. Fork on GitHub, then clone your fork
git clone https://github.com/<your-username>/email-template-studio.git
cd email-template-studio

# 2. Install deps (Node ≥ 22, pnpm ≥ 10)
pnpm install

# 3. Verify everything works
pnpm test
pnpm build

# 4. Run the studio against the bundled example
pnpm dev:studio
```

Open <http://127.0.0.1:3100>. If you see the studio with four sample templates, you're ready.

## Project layout

See [docs/GUIDE.md → Architecture](docs/GUIDE.md#architecture). The short version:

- `packages/core` — engine (pure library, no UI / CLI concerns)
- `packages/cli` — terminal commands
- `apps/studio` — React + Vite UI with an Express API
- `examples/basic` — reference project the studio runs against

## Workflow

### 1. Pick or open an issue

For anything beyond a typo, open or comment on an issue first so we can agree on scope before you spend time writing code.

### 2. Create a branch

```bash
git checkout -b feat/short-description
# or fix/, docs/, refactor/, test/, chore/
```

### 3. Make changes with tests

**This project follows TDD.** For any behavior change:

1. Write a failing test first
2. Implement the minimum code to make it pass
3. Refactor if needed
4. Run the full suite before committing

Tests live next to source as `*.test.ts` / `*.test.tsx`. Fixtures go under `packages/core/test/fixtures/`.

### 4. Run the checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

All four must pass before you open a PR. CI runs the same checks.

### 5. Add a changeset (for `core` / `cli` changes)

If your change affects the public API of `@email-template-studio/core` or `@email-template-studio/cli`:

```bash
pnpm changeset
```

Pick the bump level (`patch` / `minor` / `major`) and write a one-line summary. Commit the generated file in `.changeset/`.

### 6. Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(core): add plain-text fallback rendering
fix(cli): handle missing config file gracefully
docs(readme): clarify SMTP setup
refactor(studio): extract preview iframe into hook
test(core): cover nested partial includes
chore: bump playwright to 1.55
```

Scope is the package or area (`core`, `cli`, `studio`, `docs`, `examples`).

### 7. Open the PR

Push your branch and open a pull request against `main`. In the description:

- Link the issue (`Closes #123`)
- Describe what changed and **why**
- Note any breaking changes
- Include screenshots / screen recordings for UI changes

The CI must be green before review. Maintainers will respond within a few days.

## Code conventions

- **TypeScript** everywhere, strict mode, ESM (`"type": "module"`)
- **Imports** use `.js` extensions even for `.ts` sources (NodeNext resolution)
- **File names** are `kebab-case.ts` / `kebab-case.tsx`, one responsibility per file
- **Tests** sit next to the code they test
- **No abbreviations** in public API names (`config` not `cfg`, `template` not `tpl`)
- **Match surrounding style** — comment density, naming idioms, formatting
- **Prettier** runs via `pnpm format`; CI checks `pnpm format:check`

## Adding a new email template (to the bundled example)

If your contribution adds a new sample template to `examples/basic/`:

1. Drop the file in `examples/basic/src/pages/your-template.mjml`
2. Use neutral placeholder copy — no company names, real domains, real people
3. Reference existing partials (`<mj-include path="../components/header.mjml" />`) where possible
4. Verify it renders in the studio (`pnpm dev:studio`)
5. Add a smoke test in `packages/core/src/examples-smoke.test.ts` if it exercises a new path

## Adding a feature to `core`

1. Read [docs/GUIDE.md → Architecture](docs/GUIDE.md#architecture) so you stay inside the boundary (`core` has no UI / CLI awareness)
2. Add the function under the right subdirectory (`config/`, `fs/`, `render/`, `validate/`, `send/`, `variables/`, `output/`)
3. Write tests first, including a fixture if needed
4. Re-export from `packages/core/src/index.ts` if it's part of the public API
5. Add a changeset

## Adding a CLI command

1. Implement the command handler in `packages/cli/src/commands/<name>.ts` — keep it thin, delegate to `core`
2. Wire it up in `packages/cli/src/index.ts`
3. Add an entry to the CLI table in the [README](README.md#cli)
4. Add a test
5. Add a changeset

## Adding to the studio UI

1. New components live in `apps/studio/src/components/`
2. Hooks in `apps/studio/src/hooks/`
3. API routes in `apps/studio/server/routes/`
4. Add a Playwright spec in `apps/studio/e2e/` for any new user-facing flow
5. For visual changes, attach a screenshot to the PR

## Documentation changes

- Single source of truth for guidance is `docs/GUIDE.md`
- README is the front door — keep it skimmable
- Use absolute paths in commands and code snippets
- Keep examples copy-pasteable

## Release process

Maintainers run releases. The flow is:

1. PRs land on `main` with changesets
2. Maintainer triggers the `release` workflow (manual dispatch in GitHub Actions)
3. Changesets opens / updates a "Version Packages" PR
4. Merging that PR publishes new versions to npm and tags the release

You don't need to bump versions in your PR — just include the changeset.

## License

By contributing, you agree your contributions are licensed under the project's [MIT License](LICENSE).

## Thanks

Open source is built by people who show up. Thank you for showing up.
