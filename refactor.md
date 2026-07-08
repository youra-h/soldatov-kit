# refactor: bridge — вынос framework-agnostic логики из ui-vue в core

## Контекст

Проект: `soldatov-kit` — framework-agnostic UI component library. `core/` = бизнес-логика (чистый TS), `ui-vue/` = Vue 3 рендеринг.

**Ветка:** `adapter`

## Проблема

`useEventState` и `useSyncProps` в `ui-vue/composables/` содержат framework-agnostic логику (подписка на события `IEventSource` + геттер), смешанную с Vue-специфичной реактивностью (`customRef`, `track`, `trigger`, `onUnmounted`). Это нарушает принцип «core/ должен быть framework-free» и делает невозможным переиспользование для React/Solid/etc.

## Решение

Выделить framework-agnostic ядро в `core/bridge/` с контрактом `IReadableStore<T>` (совместим с React `useSyncExternalStore`).

### Архитектура

```
core/bridge/
  event-store.ts    # IReadableStore<T> + createEventStore()
  sync-stores.ts    # PropSpec, createSyncStores() — аналог useSyncProps без Vue
  index.ts

ui-vue/composables/
  useEventState.ts  # Vue-адаптер: IReadableStore<T> → Ref<T>  (14 строк)
  useSyncProps.ts   # вызывает createSyncStores() + оборачивает useEventState()
```

### Цепочка вызовов

```
useSyncProps(events, map)
  → createSyncStores(events, map)          // core/bridge/sync-stores.ts
    → createEventStore(events, getter, []) // core/bridge/event-store.ts
      → IReadableStore<T>                  // { getSnapshot, subscribe }
  → useEventState(store)                   // ui-vue/composables/useEventState.ts
    → Ref<T>                               // Vue customRef
```

### IReadableStore<T> — ключевой интерфейс

```ts
interface IReadableStore<T> {
    getSnapshot(): T
    subscribe(listener: () => void): () => void  // возвращает unsubscribe
}
```

Совместим с React `useSyncExternalStore`. Для остальных фреймворков адаптер — 10-15 строк.

### Ключевая особенность createEventStore

Авто-отписка от `IEventSource` при нуле подписчиков (в отличие от старого кода, где отписка была только по `onUnmounted`).

## Что уже сделано

- [x] `src/core/bridge/event-store.ts` — создан
- [x] `src/core/bridge/sync-stores.ts` — создан (типы `PropSpec`, `PropSpecInput`, `PropSpecMap` переехали сюда из `useSyncProps.ts`)
- [x] `src/core/bridge/index.ts` — создан
- [x] `src/core/index.ts` — добавлен `export * from './bridge'`
- [x] `src/ui-vue/composables/useEventState.ts` — переписан: принимает `IReadableStore<T>` вместо `(events, getter, triggers)`
- [x] `src/ui-vue/composables/useSyncProps.ts` — переписан: внутри `createSyncStores()` + `useEventState()`, типы импортируются из `@core`
- [x] Неиспользуемые импорты `useEventState` удалены из `icon/base.component.ts` и `icon/Icon.vue`

## Что осталось

- [ ] `npx vue-tsc --noEmit` — проверка типов
- [ ] `npx vitest run` — прогон тестов
- [ ] При падении типов: проверить, что `PropSpec`, `PropSpecInput`, `PropSpecMap` корректно реэкспортятся через `@core`

## Обратная совместимость

Все 39 вызовов `useSyncProps()` в компонентах **не изменились**. Сигнатура осталась прежней:

```ts
useSyncProps(events: IEventSource, map: PropSpecMap): SyncPropsResult<TMap>
```

## Дальнейшие планы (опционально)

После стабилизации bridge можно вынести в `core/bridge/` и другие композаблы:
- Логику из `useBundle.ts` → `resolveBundle()`
- Логику из `useInstance.ts` → `createInstance()`

## Примечания по кодстайлу

- Не добавлять комментарии/docstrings к коду, который не менялся
- Не вводить хелперы/абстракции для одноразового использования
- Костыли (inline workarounds) запрещены — если нужен архитектурный фикс, сначала обсудить
