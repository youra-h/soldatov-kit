# Copilot instructions for this repo

## Big picture
- This is a Vue 3 + Vite + TypeScript library/app. Runtime UI is in `src/packages/ui` and “headless” component logic is in `src/core`.
- `src/core` contains class-based component models with props + events (framework-agnostic). Vue components in `src/packages/ui/**` wrap these classes and sync Vue props ⇄ class instances via `watch()`.
- Public exports are aggregated from `src/core/index.ts` (core) and package barrels under `src/packages/**`.

## Core architecture (`src/core`)
- Base pattern: classes expose state via `getProps()` and a `static defaultValues` object.
- Constructors typically accept `IComponentOptions<TProps>` and normalize options via `TComponent.prepareOptions(options, 'css-base-class')`.
- Event system:
  - `TEventEmitter` (`src/core/common/event-emitter.ts`) is the low-level emitter.
  - `TEvented` (`src/core/common/evented.ts`) wraps it and is used as `instance.events` on components.
- Example of headless control composition: `TControl` uses behavior helpers (focus/text) + size helper and re-emits behavior changes as component events.

## Vue UI wrappers (`src/packages/ui`)
- Each UI package typically has a `base.component.ts` that defines:
  - `props*` with defaults taken from the corresponding core class `*.defaultValues`.
  - `emits*` mirroring core events.
  - `sync*()` which binds Vue props to the core instance using `watch()` and emits `update:*` events when appropriate.
- Example pattern: `src/packages/ui/control-input/base.component.ts` syncs `variant/readonly/required/...` to a `TControlInput` instance.

## Imports and path aliases
- Prefer Vite aliases from `vite.config.ts`:
  - `@core` → `src/core`
  - `@ui` → `src/packages/ui`
  - `@packages` → `src/packages`
  - `@icons` → `src/packages/icons`
  - `@` → `src`

## Developer workflows
- Node engine: see `package.json#engines` (Node 20.19+ or 22.12+).
- Dev server: `npm run dev`
- Typecheck: `npm run type-check` (uses `vue-tsc`)
- Build: `npm run build`
- Unit tests:
  - All: `npm run test:unit`
  - Core-only: `npm run test:core` (tests in `src/core/__tests__`)
  - UI-only: `npm run test:ui` (tests in `src/packages/__tests__`)
- E2E: `npm run test:e2e` (Playwright config in `playwright.config.ts`, tests in `e2e/`)

## Repo conventions to follow
- Core classes are usually `export default class ...` with a named re-export from the folder `index.ts` barrel.
- When adding a new core class folder, update the relevant barrel export (often `src/core/index.ts` and the folder `index.ts`).
- When adding a new UI wrapper, use the existing `Base*` + `sync*` pattern and source default prop values from the corresponding core `defaultValues`.
