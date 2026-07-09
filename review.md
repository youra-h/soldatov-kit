# Рецензия на `soldatov-kit`

## Общая оценка

Крепкий, продуманный прототип с сильной архитектурой. Видно, что автор понимает, как работают headless-библиотеки (Radix, Headless UI, Ark UI) и сознательно ушёл от их ограничений — полное разделение логики и рендеринга, а не просто «слоты в компоненте». Проект готов к переходу в workspace-структуру.

---

## ✅ Что хорошо

### 1. Архитектурный слой — разделение core/foundation/ui

Трёхслойная модель (бизнес-логика → дизайн-токены → рендер) — это именно то, что позволяет потом добавить React/Angular/Svelte без переписывания логики. `core/` действительно чистый: ни одного импорта Vue, всё на классах и событиях.

### 2. Иерархия классов — грамотная

```
TEntity → TComponent → TComponentView → TStylable → TControl → TTextable → TButton
```

Каждый уровень добавляет ровно один срез ответственности:
- `TEntity` — uid, assign, toJSON
- `TComponent` — id, events, rendered/visible
- `TComponentView` — tag, classes, ready
- `TStylable` — variant, size
- `TControl` — disabled, focused

Никакой «раздутой» 15-уровневой иерархии, всё по делу.

### 3. `TEvented` + `relay` — система событий

`relay` — мощнейший механизм. Декларативный проброс событий с переименованием (`as`) и хуками (`then`) позволяет родительскому компоненту (TTabs) подписываться на события дочерних (TTabItem) **до того, как внешний код увидит событие добавления**. Это решает классическую проблему «кто первый подписался».

```ts
this.events.relay(this._collection.events, [
  {
    from: 'item:added',
    then: ({ item }) => {
      item.events.on('close', () => this.closeTab(item))  // ← подписка ДО уведомления внешних
    },
  },
])
```

`emitResolve`/`emitResolveAll` — аккуратная реализация short-circuit/collect паттернов поверх событийной шины.

### 4. `TStateUnit` + `resolver` — отличная абстракция

Хранимое значение + опциональный преобразователь при чтении. Позволяет, например, `closable` таба вычислять как `this._closable && !this.disabled` без дублирования логики во всех местах чтения:

```ts
this._states.closable.setResolver((current) => current && !this.disabled)
```

Это чище, чем геттеры с побочными эффектами, и прозрачнее, чем computed во Vue.

### 5. `useEventState` / `useSyncProps` — правильный мост core ↔ Vue

Основная проблема реактивности: мутации внутри raw-классов невидимы для Vue Proxy. Решение через `customRef` + события — элегантное и производительное:

```ts
export function useEventState<T>(events, getter, triggerEvents): Ref<T> {
  // customRef: track при чтении, trigger при событии
}
```

Не `watch`, не `computed`, не `setInterval` — именно события. Это правильно.

### 6. `useInstance` — ctrl-паттерн

```ts
const provided = props.ctrl
return provided ? toRaw(provided) : new Ctor({ props })
```

Позволяет передать готовый инстанс снаружи (например, когда родитель создал дочерний элемент и хочет отдать его в компонент) или создать новый на месте. Классический DI-паттерн, реализованный минимально.

### 7. Тесты — есть и покрывают логику

Юнит-тесты на core (Vitest), e2e на Playwright. Тесты на табы, коллекции, selectable, activatable — все ключевые механики покрыты.

### 8. COLOR-USAGE.md — документирование дизайн-токенов

Таблица «какой компонент какие шейды использует» — редкость даже в коммерческих проектах. Сильно упрощает дизайн-ревью.

---

## ⚠️ Что можно улучшить

### 1. `constructor`-паттерн с `prepareOptions` — избыточная сложность

```ts
constructor(options: IComponentOptions<TProps, TStates> | Partial<TProps> = {}) {
  const ctor = new.target as typeof TComponent
  const { props = {} as Partial<TProps>, states } = ctor.prepareOptions<TProps, TStates>(options)
  super()
  // ...
}
```

Статический метод `prepareOptions` различает `{ props: {...} }` и plain `{...}` эвристикой по ключам (`hasPropsKey`, `hasStatesKey`, `hasRenderConfigKey`). Это «умно», но хрупко: если у компонента появится prop с именем `props` или `states` — сломается.

**Предложение:** для workspace-версии подумать над разделением на два конструктора или фабрику:
```ts
static create(props: Partial<TProps>): TButton
new TButton({ props: {...}, states: {...} })
```

### 2. Много `as`-кастов в event-системе

```ts
(this.events as TEvented<TComponentEvents>).emit('change:rendered', payload.newValue)
(this.events as TEvented<TTabsEvents>).emit('item:closable', item, !!value)
```

Это следствие дженерик-типов: у родителя (`TComponent<TProps, TEvents>`) `this.events` типизирован как `TEvented<TEvents>`, а в дочернем методе ты эмитишь события из расширенного `TTabsEvents`. TypeScript не знает, что `this` уже `TTabs`.

**Решение:** объявить `protected abstract events: TEvented<TEvents>` в базовом классе вместо `public readonly events`, и переопределять в каждом конкретном классе — тогда TypeScript будет выводить правильный тип.

### 3. Duck typing `IEventSource` — может быть строже

```ts
export interface IEventSource {
  on(event: string, handler: (...args: any[]) => void): void
  off(event: string, handler: (...args: any[]) => void): void
}
```

`any[]` теряет типобезопасность. Но это осознанный выбор — `useEventState` работает с разными `TEvented<T>` с разными сигнатурами событий. Компромисс приемлемый для текущей фазы.

### 4. `TBasePlugin` — слишком абстрактный

```ts
export abstract class TBasePlugin<TCustomEvents = {}> {
  get key(): string { return (this.constructor as unknown as { key: string }).key }
  install(_bundle: IPluginBundle): void {}
  destroy(): void { ... }
}
```

`key` через статическое поле конструктора + каст к `unknown` — неидиоматично. Лучше `abstract static key: string` (TS 4.4+), или сделать `key` обязательным параметром конструктора.

### 5. Tree — может быть проще

`TTree` наследуется от `TTreeCollection`, которая наследуется от `TCollection`. DFS-поиск и bubbling — хорошая база, но нет `flat()`/`iterator()` для удобного обхода. При работе с деревом в UI (например, TreeView) это понадобится.

### 6. Документация для контрибьюторов

`copilot-instructions.md` отличный, но только для AI. Для людей нужен хотя бы `CONTRIBUTING.md` с:
- как добавить новый компонент
- как добавить новый фреймворк (ui-react)
- соглашение о коммитах (conventional commits?)

### 7. CI/CD

В `package.json` нет `ci`-скрипта. Для монорепы с workspaces понадобится что-то вроде:
```json
"ci": "npm run type-check && npm run test:core && npm run test:plugins && npm run lint"
```
Плюс GitHub Actions для PR.

---

## 🏗️ Структурные наблюдения (перед миграцией в workspaces)

| Сейчас (`soldatov-kit`) | В `soldy` (workspaces) |
|---|---|
| `src/core/` | `packages/core/src/` |
| `src/foundation/` | `packages/foundation/` |
| `src/icons/` | `packages/icons/` |
| `src/plugins/` | `packages/plugins/` |
| `src/ui-vue/` | `packages/ui-vue/` |
| Общие тесты в `src/core/__tests__/` | Тесты внутри каждого пакета (`packages/core/src/__tests__/`) |
| Один `package.json` | У каждого пакета свой `package.json` |

Ключевой момент для миграции: **тесты нужно разнести по пакетам**. Сейчас все юнит-тесты лежат в `src/core/__tests__/`, но после разделения `ui-vue`-специфичные тесты должны переехать в `packages/ui-vue/src/__tests__/`.

---

## 📊 Итоговая оценка по категориям

| Категория | Оценка | Комментарий |
|-----------|:------:|-------------|
| Архитектура | ⭐⭐⭐⭐⭐ | Глубоко продумана, готова к расширению |
| API событий | ⭐⭐⭐⭐⭐ | `relay` + `emitResolve` — изобретательно и практично |
| Типизация | ⭐⭐⭐⭐ | Дженерики хорошие, но много cast'ов |
| Тесты | ⭐⭐⭐⭐ | Покрытие хорошее, можно больше edge-кейсов |
| Документация | ⭐⭐⭐ | `copilot-instructions.md` и `COLOR-USAGE.md` — отлично, но для людей маловато |
| Готовность к workspaces | ⭐⭐⭐⭐ | Почти готово, нужно разнести тесты |

**Вердикт:** прототип перерос статус прототипа. Можно переносить в `soldy` и добавлять следующие фреймворки. Единственное — нужно решить вопрос со scope-неймингом на npm (`@soldy` занят).
