# soldatov-kit — Project Guidelines

## Project Overview

Framework-agnostic UI component library. Business logic is fully decoupled from rendering.
Currently in prototype/validation phase with Vue 3 as the first rendering target.

## Workspace Structure

```
src/
  core/         # Business logic — pure TypeScript, zero framework code
  ui-vue/       # Vue 3 rendering layer
  foundation/   # Shared across all future frameworks (Tailwind 4, theme, styles)
  icons/        # SVG icons (check, close, intermediate, etc.)
```

### `core/`

All logic lives here. No Vue, React, or Angular imports allowed.

**Class hierarchy** (inheritance chain):
```
TEntity
└── TComponentModel          # id, events
    └── TComponentView       # tag, classes, visible, rendered, show/hide
        ├── TStylable        # + variant, size
        │   └── TControl     # + disabled, focused
        │       ├── TTextable      # + text
        │       ├── TValueControl  # + value
        │       └── TInputControl  # + placeholder, etc.
        └── TInteractive     # + disabled, focused (без variant/size)
```

**Collections** (`src/core/base/collection/`):
- `TCollection` — base: add, delete, move, find, items
- `TActivatableCollection` — extends TCollection, single `activeItem`
- `TSelectableCollection` — extends TCollection, `selected` (array of selected items) + `mode` (`single`/`multiple`/`none`)

**States** (`src/core/base/states/`):
- `TStateUnit` — base for extensible state properties (visible, rendered, disabled, etc.)
- Ready-made states in `states/` folder

**Events** (`src/core/common/`):
- `TEventEmitter` — raw emitter
- `TEvented<TEvents>` — typed wrapper used by all components via `component.events`
- Methods: `on`, `off`, `emit`, `emitWithResult` (returns `false` if any handler returned `false`), `emitResolve<T>` (first non-undefined return), `emitResolveAll<T>` (all non-undefined returns)
- Inter-component communication uses events, NOT constructor parameters or direct references

**Components** (`src/core/components/`): button, check-box, icon, spinner, switch, tabs, tree

**Common utils** (`src/core/common/`): event-emitter, evented, is-same, resolve-state, types, uid

### `ui-vue/`

Vue 3 (currently 3.5.x) rendering layer. Uses `reactive()` to wrap core class instances.

**Important**: Vue reactivity does NOT intercept `Array.splice()` calls inside class methods. Use `customRef` + collection events for reactive lists (see `useCollectionItems` composable).

**Composables** (`src/ui-vue/composables/`):
- `useBaseSetup` — standard component setup
- `useCollectionItems` — reactive list from collection events
- `useEventRef` — reactive Ref that updates on specified events (base primitive for `useCollectionItems` and similar)
- `useManagedInstance` — instance lifecycle

**Demo** (`src/ui-vue/demo/`):
Each component has a folder under `demo/components/<name>/` with three files:
- `Component.vue` — props-based usage
- `Instance.vue` — instance-based usage  
- `Slots.vue` — slots and visual variants showcase
- Each demo page must include a **Properties panel** listing all component props and events

Playgrounds (`demo/playgrounds/`) combine all three into one page.

### `foundation/`

- `tailwind/` — Tailwind 4 entry point (`index.css`)
- `theme/color.css` — Color palette. **CANNOT be extended.** Use only existing tokens.
- `styles/` — Tailwind utilities (can be extended)
- `COLOR-USAGE.md` — documents which colors each component uses. **Must be updated** when adding new components.

### `icons/`

SVG icon files. Connected in `ui-vue` via `useIconImport(path)` composable which returns a component tag:
```ts
const checkIcon = useIconImport('../../icons/check.svg')
// then used as: <Icon :tag="checkIcon" />
```

### File naming convention (`core/`)

Each component lives in a folder named in **kebab-case**. Files inside follow a fixed pattern:

```
<component-name>/
  <component-name>.class.ts   # The class (e.g. button.class.ts → TButton)
  types.ts                    # Interfaces, event types, props types
  index.ts                    # Barrel export
```

Sub-components nest inside the parent folder with the same pattern:
```
tabs/
  tabs.class.ts
  types.ts
  index.ts
  tab-item/
    tab-item.class.ts
    types.ts
```

**Naming plurality rules:**
- Standalone components are singular: `TButton`, `TCheckBox`, `TIcon`
- Collection-container components are plural (industry convention): `TTabs`, `TTree`
- Items inside a collection use the `Item` suffix: `TTabItem`, `TTreeItem` — **not** `TTab`/`TTree` to avoid visual confusion with the container name

### Colors
- **Never invent new color tokens.** Use only what exists in `foundation/theme/color.css`.
- **Never extend the color palette** without explicit user request.
- When adding a new component, update `COLOR-USAGE.md` with the colors it uses.
- Keep color usage minimal — components should look good with as few tokens as possible.

### Architecture
- `core/` must stay framework-free. Never import Vue/React/Angular there.
- Components communicate via **events**, not constructor parameters or shared variables.
- `_underscored` event names (e.g., `resolve:_activatablePredicate`) signal internal/private events not intended for external use.
- Event contracts (payload types, return semantics) must be documented in `types.ts` alongside the component class.

### TypeScript
- Interfaces use `I` prefix: `ITabItem`, `IActivatableCollection`
- Classes use `T` prefix: `TTabItem`, `TActivatableCollection`
- Event types use `T...Events` suffix: `TTabItemEvents`, `TActivatableCollectionEvents`
- Use generics with defaults (`TTab = any`) to avoid contravariance issues with event handlers

### Code Style
- Do not add comments, docstrings, or type annotations to code that wasn't changed
- Do not add error handling for impossible scenarios
- Do not introduce helpers or abstractions for one-time use

### Crutches / Workarounds — BANNED
- **Never introduce inline workarounds (костыли)** — duplicated logic, raw `customRef`/`onUnmounted` directly in component setup when a composable pattern already exists, ad-hoc event wiring that bypasses the established architecture, etc.
- If the proper fix requires a new composable, a new method on a class, or a change in the core layer — **propose the architectural approach to the programmer first and wait for approval before implementing it**.

## Build & Test

```bash
# Run unit tests (Vitest)
npx vitest run

# Run specific test file
npx vitest run src/core/__tests__/tabs.spec.ts

# Type check
npx vue-tsc --noEmit
```

Tests live in `src/core/__tests__/` (unit) and `e2e/` (Playwright).
