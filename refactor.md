# Рефакторинг: монорепа + workspaces

## Проблема git submodules

**Git submodules** — это боль:

- `detached HEAD` после каждого клонирования
- Нужно помнить `git submodule update --init --recursive`
- Атомарные коммиты через несколько репозиториев — ад
- Рефакторинг, затрагивающий core + ui-vue, превращается в танец с бубном

## Решение: npm/pnpm workspaces

```
soldatov-kit/
├── packages/
│   ├── core/              # ~ src/core
│   ├── foundation/         # ~ src/foundation
│   ├── icons/              # ~ src/icons
│   ├── plugins/            # ~ src/plugins
│   ├── ui-vue/             # ~ src/ui-vue
│   ├── ui-react/
│   ├── ui-angular/
│   ├── ui-svelte/
│   └── ui-solid/
├── package.json            # workspaces: ["packages/*"]
└── tsconfig.base.json
```

Каждый `packages/*` — самостоятельный `package.json` со своим `vite.config.ts`.
Зависимости между ними — через workspace-ссылки:

```json
// packages/ui-vue/package.json
{
    "dependencies": {
        "@soldatov/core": "workspace:*"
    }
}
```

## Как подхватывать core на лету (без компиляции)

Уже работающий подход — **TypeScript path aliases + Vite**:

```ts
// packages/ui-vue/vite.config.ts
resolve: {
  alias: {
    '@soldatov/core': path.resolve(__dirname, '../core/src')
  }
}
```

Vite транпилирует TS из core на лету. Никакой предварительной сборки не нужно.

Если когда-то захочется собирать core отдельно — добавишь в `core/package.json` поле `"main": "./dist/index.js"`, и workspace-ссылка `"workspace:*"` подхватит его автоматически.

## Насчёт plugins

**Вариант А** — оставить отдельным пакетом:

```
packages/plugins/      # зависит от @soldatov/core
```

**Вариант Б** — положить внутрь core:

```
packages/core/
  src/
    components/
    common/
    bridge/
    plugins/            # здесь
```

**Вывод:** если плагины — базовая инфраструктура (event-store, sync-stores), то в core. Если опциональные расширения (drag-and-drop для конкретных use-case'ов) — отдельный пакет.

## Сравнение

|                            | Submodules   | Workspaces      |
| -------------------------- | ------------ | --------------- |
| Сложность                  | 🟥 Высокая   | 🟩 Низкая       |
| Рефакторинг между пакетами | 🟥 Ад        | 🟩 Одна команда |
| On-the-fly resolution      | 🟩 Работает  | 🟩 Работает     |
| CI/CD                      | 🟥 Сложнее   | 🟩 Проще        |
| Онбординг новичков         | 🟥 3 команды | 🟩 1 clone      |

---

## Название проекта: Soldy

**Soldy** (от Soldatov) — лучше абстрактного Solty.

- **Личный бренд** — как shadcn, sindresorhus, antfu — запоминается именно через автора
- **Уникальность** — `soldy` 100% нигде не занято
- **Звучит** — коротко, современно, легко произносится

```
@soldy/core
@soldy/ui-vue
@soldy/ui-react
@soldy/foundation
@soldy/icons
```

"Солди Компонентс бай Солдатов". Если проект выстрелит — фамилия будет на слуху у сообщества.
