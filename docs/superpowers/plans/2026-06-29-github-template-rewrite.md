# GitHub Template Repo Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the repo from a publishable npm package into a flat GitHub template repository that people clone and use directly.

**Architecture:** Engine source moves from `packages/email-template-studio/src/` into `.studio/src/`. User template files move from `examples/basic/src/` to `src/` at root. A single root `package.json` (npm, no workspaces) replaces the pnpm workspace setup. No CLI binary, no publish config.

**Tech Stack:** TypeScript ESM, tsx (runtime, already in devDeps), Vitest, Vite, React, Express, MJML, chokidar, nodemailer.

## Global Constraints

- Node.js ≥ 22
- npm (not pnpm) — no `pnpm-workspace.yaml`, no `.npmrc`
- `private: true` in `package.json` — never publishable
- No `bin`, `main`, `exports` fields in `package.json`
- All runtime deps move to `devDependencies` (no runtime consumers)
- TypeScript ESM — all source imports use `.js` extensions
- Tests colocated with source as `*.test.ts` / `*.test.tsx`
- `tsx` used to run CLI in dev scripts (already in devDeps as `tsx@^4.20.3`)

---

### Task 1: Move engine source to `.studio/src/`

**Files:**
- Create: `.studio/src/` (directory — git tracks files, not dirs)
- Move: `packages/email-template-studio/src/core/` → `.studio/src/core/`
- Move: `packages/email-template-studio/src/cli/` → `.studio/src/cli/`
- Move: `packages/email-template-studio/src/studio/` → `.studio/src/studio/`
- Move: `packages/email-template-studio/src/index.ts` → `.studio/src/index.ts`
- Move: `packages/email-template-studio/src/index.test.ts` → `.studio/src/index.test.ts`
- Delete: `packages/email-template-studio/` (entire directory after move)

**Interfaces:**
- Produces: `.studio/src/` with all engine TypeScript source intact (no content changes yet)

- [ ] **Step 1: Move engine source with git mv (preserves history)**

```bash
mkdir -p .studio/src
git mv packages/email-template-studio/src/core .studio/src/core
git mv packages/email-template-studio/src/cli .studio/src/cli
git mv packages/email-template-studio/src/studio .studio/src/studio
git mv packages/email-template-studio/src/index.ts .studio/src/index.ts
git mv packages/email-template-studio/src/index.test.ts .studio/src/index.test.ts
```

- [ ] **Step 2: Move bin and static assets**

```bash
git mv packages/email-template-studio/bin .studio/bin
git mv packages/email-template-studio/static .studio/static 2>/dev/null || true
```

- [ ] **Step 3: Remove leftover package directory**

```bash
rm -rf packages/
```

- [ ] **Step 4: Verify structure**

```bash
find .studio/src -type f | sort
```

Expected output: all the TypeScript files that were under `packages/email-template-studio/src/`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move engine source to .studio/src/"
```

---

### Task 2: Move user template files to `src/` at root

**Files:**
- Move: `examples/basic/src/` → `src/`
- Move: `examples/basic/email-template-studio.config.ts` → `email-template-studio.config.ts`
- Move: `examples/basic/.env.example` → `.env.example`
- Delete: `examples/` directory

**Interfaces:**
- Produces: `src/pages/`, `src/components/`, `src/styles/` at repo root; `email-template-studio.config.ts` at root

- [ ] **Step 1: Move user template source**

```bash
git mv examples/basic/src src
git mv examples/basic/email-template-studio.config.ts email-template-studio.config.ts
git mv examples/basic/.env.example .env.example
```

- [ ] **Step 2: Move built dist if present**

```bash
mv examples/basic/dist dist 2>/dev/null || true
```

- [ ] **Step 3: Remove examples directory**

```bash
rm -rf examples/
```

- [ ] **Step 4: Verify**

```bash
ls src/
# Expected: components  pages  styles
cat email-template-studio.config.ts
# Expected: pagesDir: 'src/pages', componentsDir: 'src/components', stylesDir: 'src/styles', outDir: 'dist'
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move user templates to src/ at root"
```

---

### Task 3: Replace root package.json (npm, no workspaces)

**Files:**
- Modify: `package.json` (full rewrite)
- Delete: `pnpm-workspace.yaml` (if exists)
- Delete: `.npmrc`
- Delete: `.changeset/`

**Interfaces:**
- Produces: single `package.json` with `private: true`, npm scripts `dev`/`build`/`validate`/`test`/`build:studio`, all deps merged from old root + package devDeps

- [ ] **Step 1: Check what files to delete**

```bash
ls pnpm-workspace.yaml .npmrc .changeset/ 2>/dev/null
```

- [ ] **Step 2: Delete pnpm/changeset files**

```bash
rm -f pnpm-workspace.yaml .npmrc
rm -rf .changeset/
```

- [ ] **Step 3: Write new package.json**

Replace entire `package.json` with:

```json
{
  "name": "email-template-studio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx .studio/src/cli/run-cli.ts dev",
    "build": "tsx .studio/src/cli/run-cli.ts build",
    "validate": "tsx .studio/src/cli/run-cli.ts validate",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "build:studio": "vite build -c .studio/vite.studio.config.ts"
  },
  "devDependencies": {
    "@playwright/test": "^1.53.1",
    "@testing-library/react": "^16.3.0",
    "@types/express": "^5.0.3",
    "@types/mjml": "^5.0.0",
    "@types/node": "^24.0.10",
    "@types/nodemailer": "^6.4.17",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.7.0",
    "chokidar": "^4.0.3",
    "dotenv": "^16.6.1",
    "eslint": "^9.30.1",
    "execa": "^9.6.0",
    "express": "^5.1.0",
    "jsdom": "^26.1.0",
    "mjml": "^4.15.4",
    "nodemailer": "^6.10.1",
    "prettier": "^3.6.2",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tsx": "^4.20.3",
    "typescript": "^5.8.3",
    "vite": "^7.0.0",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 4: Install with npm to generate lock file**

```bash
npm install
```

Expected: `package-lock.json` created, `node_modules/` populated.

- [ ] **Step 5: Verify no pnpm artifacts**

```bash
ls pnpm-lock.yaml pnpm-workspace.yaml .npmrc 2>&1
# Expected: "No such file or directory" for each
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json
git add -u  # stage deletions
git commit -m "refactor: replace pnpm workspace with single npm package.json"
```

---

### Task 4: Update tsconfig at root

**Files:**
- Modify: `tsconfig.json` (rewrite to cover `.studio/src/` and root `*.ts`)
- Delete: `packages/email-template-studio/tsconfig.json` (already gone after Task 1)
- Delete: `tsconfig.base.json` (if exists at root)

**Interfaces:**
- Produces: single `tsconfig.json` at root that compiles `.studio/src/**/*.ts(x)` and root `*.ts`

- [ ] **Step 1: Check for tsconfig files**

```bash
find . -name "tsconfig*.json" -not -path "*/node_modules/*" | sort
```

- [ ] **Step 2: Write root tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": ".studio/dist",
    "rootDir": ".",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    ".studio/src/**/*.ts",
    ".studio/src/**/*.tsx",
    "*.ts"
  ],
  "exclude": [
    "node_modules",
    ".studio/src/**/*.test.ts",
    ".studio/src/**/*.test.tsx"
  ]
}
```

- [ ] **Step 3: Remove old tsconfig.base.json if it exists**

```bash
rm -f tsconfig.base.json
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```

Fix any path errors (likely `../../tsconfig.base.json` extends references in moved files — search and remove those `extends` lines or point them to root tsconfig).

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json
git add -u
git commit -m "refactor: consolidate tsconfig to repo root"
```

---

### Task 5: Fix import paths broken by the move

After moving source files, internal imports that used relative paths may still work, but any path that referenced `packages/email-template-studio/` must be updated. The key breakages are:

1. `dev-server.ts` references `../../../static/studio` — static assets now at `.studio/static/studio`
2. Vitest config alias (if any) pointing at old package path
3. Vite config (for studio build) referencing old paths

**Files:**
- Modify: `.studio/src/studio/server/dev-server.ts` (static path)
- Modify: `vitest.config.ts` or `vite.config.ts` at root (if alias exists)
- Modify: `.studio/vite.studio.config.ts` (new location for studio Vite config)

**Interfaces:**
- Consumes: `.studio/src/` structure from Task 1, `tsconfig.json` from Task 4
- Produces: all internal paths correct, no broken references

- [ ] **Step 1: Find all references to old paths**

```bash
grep -r "packages/email-template-studio" .studio/ --include="*.ts" --include="*.tsx" --include="*.json" -l
grep -r "packages/email-template-studio" . --include="*.ts" --include="*.json" -l --exclude-dir=node_modules
```

- [ ] **Step 2: Fix static asset path in dev-server.ts**

In `.studio/src/studio/server/dev-server.ts`, find the line:

```ts
const staticDir = path.resolve(serverDir, '../../../static/studio');
```

Change to:

```ts
const staticDir = path.resolve(serverDir, '../../../../static/studio');
```

(Four levels up from `.studio/src/studio/server/` to repo root, then into `.studio/static/studio`.)

Actually, cleaner — resolve relative to a known anchor:

```ts
const studioRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const staticDir = path.join(studioRoot, '.studio', 'static', 'studio');
```

- [ ] **Step 3: Locate and move Vite studio config**

```bash
find . -name "vite.studio.config.ts" -not -path "*/node_modules/*"
```

If it lives inside `packages/email-template-studio/`, move it:

```bash
git mv packages/email-template-studio/vite.studio.config.ts .studio/vite.studio.config.ts 2>/dev/null || true
```

If it doesn't exist yet, check the old build script: `"build": "tsc -p tsconfig.json && vite build -c vite.studio.config.ts"`. Create `.studio/vite.studio.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export default defineConfig({
  plugins: [react()],
  root: path.join(root, '.studio/src/studio/client'),
  build: {
    outDir: path.join(root, '.studio/static/studio'),
    emptyOutDir: true,
  },
});
```

- [ ] **Step 4: Check for Vitest config alias**

```bash
cat vitest.config.ts 2>/dev/null || cat vite.config.ts 2>/dev/null || echo "no vitest config"
```

If alias like `'email-template-studio': '/packages/email-template-studio/src/index.ts'` exists, update to `'.studio/src/index.ts'`.

- [ ] **Step 5: Typecheck again**

```bash
npx tsc --noEmit
```

Fix any remaining errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: update internal paths after engine move to .studio/"
```

---

### Task 6: Wire up Vitest

**Files:**
- Create or modify: `vitest.config.ts` at root

**Interfaces:**
- Consumes: `.studio/src/` layout from Tasks 1–5
- Produces: `npm test` runs all `*.test.ts` and `*.test.tsx` files under `.studio/src/`

- [ ] **Step 1: Check existing vitest config**

```bash
cat vitest.config.ts 2>/dev/null || echo "MISSING"
```

- [ ] **Step 2: Write vitest.config.ts at root**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['.studio/src/**/*.test.ts', '.studio/src/**/*.test.tsx'],
    environment: 'jsdom',
    globals: false,
  },
});
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: all tests pass (or fail only for pre-existing reasons, not path errors).

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts
git commit -m "chore: configure vitest for .studio/src/ layout"
```

---

### Task 7: Remove `init` command and CLI binary

The `init` command scaffolds a new project — no longer needed (cloning the repo IS the scaffold). The `bin/` entry is gone (not a package).

**Files:**
- Delete: `.studio/src/cli/commands/init.ts`
- Delete: `.studio/src/cli/commands/init.test.ts`
- Delete: `.studio/bin/`
- Modify: `.studio/src/cli/run-cli.ts` — remove `init` case

**Interfaces:**
- Consumes: `.studio/src/cli/run-cli.ts`
- Produces: `run-cli.ts` with only `dev`, `build`, `validate` cases

- [ ] **Step 1: Delete init command and binary**

```bash
git rm .studio/src/cli/commands/init.ts
git rm .studio/src/cli/commands/init.test.ts 2>/dev/null || true
git rm -r .studio/bin/
```

- [ ] **Step 2: Remove init import and case from run-cli.ts**

Open `.studio/src/cli/run-cli.ts`. It currently reads:

```ts
import { parseArgs } from './parse-args.js';
import { runBuild } from './commands/build.js';
import { runDev } from './commands/dev.js';
import { runInit } from './commands/init.js';
import { runValidate } from './commands/validate.js';

export const runCli = async (argv: string[]) => {
  const parsed = parseArgs(argv);

  switch (parsed.command) {
    case 'init':
      return runInit(parsed.options);
    case 'dev':
      return runDev();
    case 'build':
      return runBuild();
    case 'validate':
      return runValidate();
    default:
      return 'Unknown command\n';
  }
};
```

Replace with:

```ts
import { parseArgs } from './parse-args.js';
import { runBuild } from './commands/build.js';
import { runDev } from './commands/dev.js';
import { runValidate } from './commands/validate.js';

export const runCli = async (argv: string[]) => {
  const parsed = parseArgs(argv);

  switch (parsed.command) {
    case 'dev':
      return runDev();
    case 'build':
      return runBuild();
    case 'validate':
      return runValidate();
    default:
      return 'Unknown command\n';
  }
};
```

- [ ] **Step 3: Update parse-args if it references `init`**

```bash
grep -n "init" .studio/src/cli/parse-args.ts
```

If `init` is listed as a valid command in the type union or help text, remove it.

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove init command and bin entry (not a package)"
```

---

### Task 8: Remove public API index (not a library)

`index.ts` exported `loadConfig`, `discoverTemplates`, etc. for programmatic use. As a template repo, no one imports this as a library.

**Files:**
- Delete: `.studio/src/index.ts`
- Delete: `.studio/src/index.test.ts`

**Interfaces:**
- Produces: no public API surface

- [ ] **Step 1: Delete index files**

```bash
git rm .studio/src/index.ts
git rm .studio/src/index.test.ts
```

- [ ] **Step 2: Check nothing imports from the index**

```bash
grep -r "from '.*index.js'" .studio/src/ --include="*.ts" --include="*.tsx"
```

If hits exist — those are internal cross-module imports, not public API consumers. Verify they aren't needed and remove or redirect.

- [ ] **Step 3: Run tests**

```bash
npm test
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove public library index (template repo, not a package)"
```

---

### Task 9: Rewrite README.md

**Files:**
- Modify: `README.md` (full rewrite)

**Interfaces:**
- Produces: README targeted at someone who just clicked "Use this template" on GitHub

- [ ] **Step 1: Rewrite README.md**

Replace entire content with:

```markdown
# Email Template Studio

> Local-first MJML email template workspace. Clone, edit templates in `src/`, preview in browser, build to HTML.

![Studio desktop preview](docs/screenshots/studio-desktop.png)

---

## Use this template

Click **"Use this template"** on GitHub, or:

```bash
git clone https://github.com/<you>/email-template-studio.git my-emails
cd my-emails
npm install
npm run dev
```

Open <http://127.0.0.1:3100>.

---

## What you get

- **MJML authoring** with `mj-include` partials and shared styles
- **Variable extraction** — `{{ expression }}` placeholders parsed automatically into typed metadata
- **Live preview** — desktop and phone modes, re-renders on variable edit
- **Test send** over SMTP — recipient configurable per-send, transport via env
- **Build** — compile every template to `dist/<id>.html`
- **Validate** — project structure and template syntax checks

---

## Project layout

```text
src/
├── pages/          ← your email templates (.mjml)
├── components/     ← reusable partials (header, footer, …)
└── styles/         ← shared style includes

.studio/            ← tooling engine (ignore unless hacking)
dist/               ← compiled HTML output (gitignored)
email-template-studio.config.ts
.env.example
```

Edit files in `src/`. The `.studio/` folder holds the engine — you don't need to touch it.

---

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start studio at <http://127.0.0.1:3100> |
| `npm run build` | Compile all templates → `dist/` |
| `npm run validate` | Check project structure + template syntax |
| `npm test` | Run unit tests |

---

## Variables

Any `{{ expression }}` in a template becomes a variable. The studio extracts them automatically and shows input fields for preview.

---

## Test sending

Copy `.env.example` to `.env` and fill in SMTP credentials. For local testing use [Ethereal](https://ethereal.email/) or [MailHog](https://github.com/mailhog/MailHog). Never commit `.env`.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for engine development notes.
```

- [ ] **Step 2: Verify screenshots still exist**

```bash
ls docs/screenshots/
```

If `studio-desktop.png` is missing, remove the image line from README.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for github template repo audience"
```

---

### Task 10: Rewrite CONTRIBUTING.md and update docs/GUIDE.md

**Files:**
- Modify: `CONTRIBUTING.md` (full rewrite — engine contributor guide)
- Modify: `docs/GUIDE.md` (path updates only)

**Interfaces:**
- Produces: CONTRIBUTING explains `.studio/` layout and contributor workflow; GUIDE has correct paths

- [ ] **Step 1: Rewrite CONTRIBUTING.md**

```markdown
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

## Rebuilding the studio client

The React UI is pre-built and committed in `.studio/static/studio/`. Only rebuild when you change files in `.studio/src/studio/client/`:

```bash
npm run build:studio
git add .studio/static/
git commit -m "chore: rebuild studio client assets"
```
```

- [ ] **Step 2: Update path references in docs/GUIDE.md**

```bash
sed -i '' \
  -e 's|packages/email-template-studio/src/|.studio/src/|g' \
  -e 's|packages/email-template-studio/|.studio/|g' \
  -e 's|examples/basic/|src/|g' \
  -e 's|pnpm|npm|g' \
  docs/GUIDE.md
```

- [ ] **Step 3: Review GUIDE.md diff**

```bash
git diff docs/GUIDE.md
```

Scan for any remaining old paths or `pnpm` references and fix manually.

- [ ] **Step 4: Commit**

```bash
git add CONTRIBUTING.md docs/GUIDE.md
git commit -m "docs: rewrite CONTRIBUTING and update GUIDE paths"
```

---

### Task 11: Update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Review current .gitignore**

```bash
cat .gitignore
```

- [ ] **Step 2: Update .gitignore**

Ensure these entries are present and correct:

```gitignore
node_modules
coverage
dist
.studio/dist
.studio/static/studio
.playwright
.playwright-cli
test-results
playwright-report
.env
.env.*
!.env.example
.DS_Store
docs/superpowers/plans
```

Remove any `packages/` or pnpm-specific entries that no longer apply.

Note: `.studio/static/studio` is gitignored only if you choose not to commit pre-built assets. If you want `npm run dev` to work without a `build:studio` step for new cloners, **remove** `.studio/static/studio` from gitignore and commit the built assets. Decide and note in the commit message.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: update .gitignore for flat repo layout"
```

---

### Task 12: Smoke test end-to-end

Verify the full dev → build → validate cycle works from a clean state.

**Files:** none (verification only)

- [ ] **Step 1: Clean install**

```bash
rm -rf node_modules
npm install
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Run validate**

```bash
npm run validate
```

Expected: exits 0, reports project valid.

- [ ] **Step 4: Run build**

```bash
npm run build
ls dist/
```

Expected: `welcome.html`, `reset-password.html`, `invoice.html`, `notification.html` (or similar).

- [ ] **Step 5: Start dev server (manual check)**

```bash
npm run dev &
sleep 3
curl -s http://127.0.0.1:3100/api/templates | head -c 200
kill %1
```

Expected: JSON array of template objects.

- [ ] **Step 6: Final commit if any fixups were needed**

```bash
git add -A
git commit -m "chore: smoke test fixups" 2>/dev/null || echo "nothing to commit"
```
