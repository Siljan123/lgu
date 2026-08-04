---
name: nuxt-layered-testing
description: Write and place Vitest/Playwright tests in a Nuxt project organized by layers (layers/some-layer/ folders merged via extends). Use whenever the user asks to write, add, or scaffold a test for a util, composable, component, plugin, API route, or user flow inside a Nuxt layers project, or mentions test/unit, test/nuxt, test/e2e, vitest projects, or Playwright specs in this context. Also use when a layer is missing its test folders and one needs to be created, or when setting up the root vitest.config.ts / playwright.config.ts that ties all layers together. Per-layer tests are unit and nuxt-environment only; end-to-end and full-app tests always live in the root test folder, never inside a layer.
---

# Nuxt Layered Testing

Writing tests for a Nuxt codebase organized into layers (each with its own
folder under `layers/`, merged into the app via `extends` in `nuxt.config.ts`).
The guiding rule: **tests live as close as possible to the code they test**.
A layer owns its unit and Nuxt-runtime tests. Only things that need a real
running app — end-to-end browser tests, or tests that deliberately span
multiple layers — go in the root `test/` folder.

## Directory layout

```
project-root/
├── layers/
│   ├── auth/
│   │   └── test/
│   │       ├── unit/        # pure logic, no Nuxt runtime — Vitest, node env
│   │       │   └── format-token.test.ts
│   │       └── nuxt/        # components/composables/plugins — Vitest, nuxt env
│   │           └── use-auth.test.ts
│   └── dashboard/
│       └── test/
│           ├── unit/
│           └── nuxt/
├── test/                     # root / global — nothing here belongs to one layer
│   ├── unit/                 # cross-layer pure logic (rare)
│   ├── nuxt/                 # cross-layer component/composable integration
│   └── e2e/                  # real browser, full app — Playwright
│       └── checkout-flow.test.ts
├── vitest.config.ts
└── playwright.config.ts
```

A layer's `test/` folder only ever contains `unit/` and `nuxt/`. Never add a
`test/e2e/` inside a layer — e2e always needs the fully assembled app, so it
belongs at the root. If a test would only make sense once several layers are
combined (e.g. a composable from one layer driving a page owned by another),
that's a "full-app" test and it also goes at the root, in `test/unit/` or
`test/nuxt/` depending on which category below it fits.

## Deciding where a new test goes

Work through these questions in order:

1. **Does it touch the Nuxt runtime at all?** — auto-imports, `#imports`,
   `#components`, composables, plugins, `useNuxtApp`, components that rely on
   injected context. If no, and it's a plain function/class you can import
   directly, it's a **unit test** (Node environment, fast, no Nuxt boot).
   If yes, it's a **nuxt test** (runs inside the `nuxt` Vitest environment via
   `@nuxt/test-utils/runtime`).
2. **Does it belong to one layer, or does it require the app to be fully
   assembled / a real browser?** If it's scoped to one layer's own
   components/composables/utils, it goes in that layer's `test/unit/` or
   `test/nuxt/`. If it needs a live server, real navigation, SSR HTML output,
   or exercises how multiple layers work together end-to-end, it's **e2e** and
   goes in root `test/e2e/`, written for the Playwright test runner.
3. **Is it a full-app integration that isn't quite e2e** (no browser needed,
   but genuinely spans layers rather than belonging to one)? Put it at the
   root, in `test/unit/` or `test/nuxt/` per the same rule as step 1 — same
   subfolder names, just at the global level instead of inside a layer.

| What you're testing | Needs Nuxt runtime? | Scope | Location |
|---|---|---|---|
| Pure util/helper function | No | One layer | `layers/<layer>/test/unit/` |
| Composable, component, plugin | Yes | One layer | `layers/<layer>/test/nuxt/` |
| Cross-layer helper function | No | Whole app | `test/unit/` |
| Cross-layer composable/component interplay | Yes | Whole app | `test/nuxt/` |
| Full user flow, SSR, real navigation | Yes (browser) | Whole app | `test/e2e/` (Playwright) |

If it's genuinely unclear which layer owns the thing being tested, ask —
don't guess and scatter a test in the wrong layer.

## Workflow for "write a test for X"

1. **Identify the subject and its layer** from the file being tested (its
   path tells you the layer) or from context in the conversation.
2. **Classify it** using the decision steps above.
3. **Check the target test folder exists** — `layers/<layer>/test/unit/` or
   `layers/<layer>/test/nuxt/` for layer-scoped tests, `test/e2e/`,
   `test/unit/`, or `test/nuxt/` at the root otherwise. If it doesn't exist
   yet, create it (`mkdir -p`). Nothing else needs updating: the root
   `vitest.config.ts` (see below) discovers test folders by glob, so a brand
   new layer or a brand new per-layer test folder is picked up automatically
   with zero config changes.
4. **Name the file `<subject>.test.ts`** — always `.test.ts`, never `.spec.ts`.
   Match the case/style of the file under test (e.g. `useAuth.ts` →
   `useAuth.test.ts`, `format-token.ts` → `format-token.test.ts`).
5. **Write the test** using the matching template below.
6. **Mention how to run it** so the user can verify: `npx vitest --project unit`,
   `npx vitest --project nuxt`, or `npx playwright test` for e2e.

## Root config

If the project doesn't have these yet, create them at the project root. Both
use glob patterns across `layers/*/test/...` so every layer's tests are
included automatically — no per-layer registration needed.

- `assets/vitest.config.ts.template` — defines the `unit` and `nuxt` Vitest
  projects. Copy to `vitest.config.ts`.
- `assets/playwright.config.ts.template` — points Playwright's `testDir` at
  root `test/e2e/` and wires up the Nuxt server via `@nuxt/test-utils/playwright`.
  Copy to `playwright.config.ts`.

Read these template files before writing a root config so the glob patterns
and project names match exactly what the rest of this skill assumes.

## Test templates

Read the relevant template before writing a new test file, then adapt it —
don't invent a different import style or structure.

- `assets/unit.test.ts.template` — plain Vitest, Node environment, no Nuxt
  imports at all.
- `assets/nuxt.test.ts.template` — Nuxt environment via
  `@nuxt/test-utils/runtime`, covers mounting a component with
  `mountSuspended`.
- `assets/e2e.test.ts.template` — Playwright test runner via
  `@nuxt/test-utils/playwright`.

### Extra patterns for nuxt-environment tests

Beyond mounting a component, `@nuxt/test-utils/runtime` gives you:

- **`renderSuspended`** — Testing-Library style rendering instead of
  `mountSuspended`, when the layer already uses `@testing-library/vue`.
- **`mockNuxtImport(name, factory)`** — mock an auto-import (e.g. `useState`,
  `useFetch`). One call per mocked import per file; it's a macro, hoisted like
  `vi.mock`.
- **`mockComponent(nameOrPath, factory)`** — replace a child component with a
  stub so a test only exercises the component under test.
- **`registerEndpoint(path, handler)`** — stand up a fake Nitro endpoint so a
  component/composable's `$fetch`/`useFetch` calls resolve to fixture data
  instead of hitting a real API.

Reach for these instead of hand-rolled mocking — they're what the rest of the
Nuxt ecosystem (and these docs) already expect, so tests stay consistent
across layers.

### Composable-specific nuxt test shape

Composables often need calling inside a component or a `setup`-like context
rather than directly, since they may rely on injected Nuxt context:

```ts
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAuth } from '../../composables/useAuth'

describe('useAuth', () => {
  it('exposes the current user', async () => {
    let result
    await mountSuspended({
      setup() {
        result = useAuth()
        return () => null
      },
    })
    expect(result.user.value).toBeDefined()
  })
})
```

## Conventions to keep consistent everywhere

- File naming: `<subject>.test.ts`, always.
- A layer's `test/` folder holds only `unit/` and `nuxt/` — never `e2e/`.
- Root `test/e2e/` is Playwright-only; it isn't part of the Vitest projects
  array in `vitest.config.ts`.
- Don't manually list layers in `vitest.config.ts` — the glob patterns in the
  template already match every layer, present or future.
- If a layer test needs an isolated Nuxt app (rather than the fully merged
  root app) — e.g. because the layer is meant to be published standalone —
  that's an advanced case: give the layer its own fixture/playground
  `nuxt.config.ts` and point `environmentOptions.nuxt.rootDir` at it inside
  that one test file. Default to the merged root app unless the user asks for
  this.
