# Reactivity Refactoring — Research Guide

> Временный документ для исследования. Удалить после выбора финального подхода.

## Контекст и проблема

### Текущая архитектура

`core/` содержит чистые TypeScript-классы без фреймворков. Каждый класс хранит состояние во вложенных `TStateUnit`-объектах:

```
TTabItem
  ._sizeState: TStateUnit<TComponentSize>      → size
  ._variantState: TStateUnit<TComponentVariant> → variant
  ._renderedState: IStateUnit<boolean>          → rendered
  ._visibilityState: IVisibilityState           → visible
  ._collectionItem: TActivatableCollectionItem  → active, collection
```

В `ui-vue` используется `useInstance`, который оборачивает raw-инстанс в `reactive()`:

```ts
export function useInstance<T extends object>(Ctor, props): Reactive<T> {
  const raw = provided ? toRaw(provided) : new Ctor({ props })
  return reactive(raw) as Reactive<T>
}
```

### Почему это не работает

**Корень проблемы: мутации происходят на raw-объекте, минуя Proxy.**

Когда `TTabs` устанавливает `tabItem.size = 'large'`:
- `tabItem` — это raw-ссылка (коллекция хранит raw-элементы)
- Proxy Vue **не перехватывает** эту запись
- Vue не знает об изменении → шаблон не обновляется

Дополнительные проблемы с `reactive(raw)`:
1. **Глубокая реактивность** оборачивает все вложенные объекты (`_sizeState`, `events`, etc.) рекурсивно → производительность
2. **Замыкания в классах** захватывают `this` как raw в момент создания (конструктор). Внутри таких коллбэков `this` уже не proxy → мутации снова на raw
3. **`shallowReactive` не работает** — геттеры типа `get size()` читают из `_sizeState.value` (вложенный объект), который `shallowReactive` не отслеживает

### Что сейчас работает как костыль

```ts
// TabItem.vue — точечный фикс для size
const size = useEventRef(instance.events, () => instance.size, ['change:size'])

// Tabs.vue — точечный фикс для activeItem и items
const items = useCollectionItems(instance.collection)
const activeItem = useEventRef(instance.collection.events, ...)
```

Это работает, но это именно костыли — нет системного решения.

---

## Approach 1: Core Proxy + shallowReactive

### Идея

Создать в `core/common` функцию `makeReactiveProxy(instance)`, которая возвращает Proxy.
Proxy перехватывает `get` для getter-свойств и сам управляет подписками на `change:X` события.
Во Vue-слое: `shallowReactive(makeReactiveProxy(raw))`.

Логика Proxy:
- `get(target, prop)` → вызов `target[prop]` + framework-специфичный `track()`
- Подписка: `target.events.on('change:${prop}', () => trigger())`
- Обычные примитивные свойства (`tag: string`) → `shallowReactive` обрабатывает сам

### TZ для реализации

1. Создать `src/core/common/reactive-proxy.ts`
2. Определить интерфейс callbacks: `{ track(prop): void, trigger(prop): void }`
3. Proxy-обёртка подписывается на `change:${prop}` при первом `get`
4. В `ui-vue/composables/useInstance.ts` заменить `reactive(raw)` на `shallowReactive(makeProxy(raw, vueCallbacks))`

### Открытые вопросы

- Как Proxy узнаёт, что у свойства есть соответствующее `change:X` событие? (конвенция vs метаданные)
- Как передать `track`/`trigger` (Vue API) в `core/` без нарушения правила framework-free?
- Что делать с методами класса? Их нельзя "трекать" по-пропертному
- Как быть с вложенными proxy (`_sizeState` тоже нужен proxy?)?
- Proxy на `events` объекте — не будет ли конфликта с уже существующими подписками?

### Потенциальные плюсы

- Шаблон остаётся без изменений: `instance.size`, `instance.variant` — как сейчас
- Единое решение — один вызов в `useInstance`, всё работает автоматически
- Можно переиспользовать логику Proxy для React/Svelte с другими callbacks

### Потенциальные минусы

- `core/` получает концепцию "реактивности" через callbacks → размывает boundary
- Сложно обработать все edge cases: методы, приватные поля, наследование, closures
- Нет гарантии что naming convention `change:${prop}` покрывает все свойства
- Отладка Proxy-объектов сложнее (console.log показывает proxy, не raw)

### Тест: что проверить

```ts
// Тест 1: внешняя мутация через raw-ссылку
const raw = new TTabItem()
const proxy = shallowReactive(makeReactiveProxy(raw))
// меняем через raw — должен сработать ре-рендер
raw.size = 'lg' // → events.emit('change:size') → proxy должен стать stale

// Тест 2: мутация внутри другого класса (TTabs → tabItem)
const tabs = new TTabs()
tabs.add(raw) // raw в коллекции
tabs.setTabSize(raw, 'lg') // TTabs вызывает raw.size = 'lg'

// Тест 3: performance benchmark — сколько объектов оборачивается в Proxy
// для дерева из 100 нод

// Тест 4: methods на proxy — не ломаются ли они?
proxy.click() // должно работать
```

### Результаты тестирования

> _Заполнить после проведения тестов_

- [ ] Тест 1: ...
- [ ] Тест 2: ...
- [ ] Тест 3: ...
- [ ] Тест 4: ...

**Вывод по Approach 1:**

> _Заполнить после тестов_

---

## Approach 2: Pure event-based (отказ от reactive wrapper)

### Идея

Полностью отказаться от `reactive(raw)` как механизма реактивности Vue-компонентов.
Вместо этого: raw-инстанс + `useEventRef` для каждого реактивного свойства.

Каждое свойство, которое нужно в шаблоне, явно подписывается на своё `change:X` событие.
События уже есть в `core/` — это и есть "реактивный слой" бизнес-логики.

### TZ для реализации

**Шаг 1**: Создать типизированные composable-хелперы в `ui-vue/composables/`:

```ts
// useComponentViewState.ts — базовые свойства TComponentView
export function useComponentViewState(instance: IComponentView) {
  return {
    rendered: useEventRef(instance.events, () => instance.rendered, ['change:rendered']),
    visible:  useEventRef(instance.events, () => instance.visible,  ['change:visible']),
    classes:  useEventRef(instance.events, () => instance.classes.list, ['change:classes']),
    tag:      useEventRef(instance.events, () => instance.tag, ['change:tag']),
  }
}

// useStylableState.ts — добавляет size + variant
export function useStylableState(instance: IStylable) {
  return {
    ...useComponentViewState(instance),
    size:    useEventRef(instance.events, () => instance.size,    ['change:size']),
    variant: useEventRef(instance.events, () => instance.variant, ['change:variant']),
  }
}

// useControlState.ts — добавляет disabled + focused
export function useControlState(instance: IControl) {
  return {
    ...useStylableState(instance),
    disabled: useEventRef(instance.events, () => instance.disabled, ['change:disabled']),
    focused:  useEventRef(instance.events, () => instance.focused,  ['change:focused']),
  }
}
```

**Шаг 2**: Изменить `useInstance` — возвращать raw (или убрать вообще):

```ts
export function useInstance<T>(Ctor, props): T {
  const provided = props.ctrl
  return provided ? toRaw(provided) : new Ctor({ props })
  // НЕТ reactive() — instance используется только для вызова методов
}
```

**Шаг 3**: Переписать setup() компонентов:

```ts
// TabItem.vue — было
const instance = useInstance(TTabItem, props) // reactive
// ...
// :size="instance.size" :variant="instance.variant"

// TabItem.vue — станет
const instance = useInstance(TTabItem, props)  // raw
const { size, variant, rendered, visible, disabled, classes } = useControlState(instance)
// ...
// :size="size" :variant="variant"
```

**Шаг 4**: Методы класса вызываются напрямую на raw — это ОК:
```ts
@click="instance.click()" // raw, методы не нуждаются в реактивности
```

### Покрытие событиями

Аудит событий, которые должны быть в `core/` для этого подхода:

| Свойство | Событие | Есть сейчас? |
|---|---|---|
| `rendered` | `change:rendered` | ✅ |
| `visible` | `change:visible` | ✅ |
| `tag` | `change:tag` | ✅ |
| `classes` | `change:classes` | ✅ |
| `size` | `change:size` | ✅ |
| `variant` | `change:variant` | ✅ |
| `disabled` | `change:disabled` | ? проверить |
| `focused` | `change:focused` | ? проверить |
| `text` | `change:text` | ? проверить |
| `value` | `change:value` | ? проверить |
| `placeholder` | `change:placeholder` | ? проверить |
| `active` (TabItem) | `change:activation` | ✅ (другое имя) |
| `closable` (TabItem) | `change:closable` | ✅ |
| `items` (Collection) | `item:added`, `item:deleted`, `cleared`, `item:moved` | ✅ |
| `activeItem` (ActivatableCollection) | `item:activated`, `item:deactivated` | ✅ |

> Перед реализацией — проверить все `?` и добавить недостающие события в core.

### Масштабируемость на другие фреймворки

```ts
// React-эквивалент useEventRef:
function useEventState<T>(events, getter, triggerEvents): [T, ...] {
  const [value, setValue] = useState(getter())
  useEffect(() => {
    const handler = () => setValue(getter())
    triggerEvents.forEach(e => events.on(e, handler))
    return () => triggerEvents.forEach(e => events.off(e, handler))
  }, [])
  return value
}

// Svelte-эквивалент:
function eventReadable<T>(events, getter, triggerEvents): Readable<T> {
  return readable(getter(), set => {
    const handler = () => set(getter())
    triggerEvents.forEach(e => events.on(e, handler))
    return () => triggerEvents.forEach(e => events.off(e, handler))
  })
}
```

Один и тот же паттерн, идиоматичный для каждого фреймворка.

### Тест: что проверить

```ts
// Тест 1: внешняя мутация через raw-ссылку
const raw = new TTabItem()
const size = useEventRef(raw.events, () => raw.size, ['change:size'])
raw.size = 'lg'
// Ожидание: size.value === 'lg'

// Тест 2: мутация через другой класс (TTabs → tabItem.size)
// TTabs хранит raw-ссылки, устанавливает size на raw
// Ожидание: ref обновляется через событие

// Тест 3: performance — 100 TabItem, каждый с 6 useEventRef
// Мерить количество event listeners: 6 per item = 600 listeners
// Сравнить с reactive() overhead

// Тест 4: onUnmounted cleanup — listeners правильно удаляются
// Смонтировать/демонтировать компонент, проверить что listeners = 0

// Тест 5: шаблон не получает .value — все refs должны быть auto-unwrapped в шаблоне Vue
```

### Результаты тестирования

> _Заполнить после проведения тестов_

- [ ] Тест 1: ...
- [ ] Тест 2: ...
- [ ] Тест 3: ...
- [ ] Тест 4: ...
- [ ] Тест 5: ...

**Вывод по Approach 2:**

> _Заполнить после тестов_

---

## Сравнение подходов

| Критерий | Approach 1 (Core Proxy) | Approach 2 (Event-based) |
|---|---|---|
| Изменения в `core/` | Нужны (makeReactiveProxy) | Только добавить недостающие события |
| Нарушение "framework-free" | Возможно (track/trigger callbacks) | Нет |
| Шаблон компонентов | Без изменений | Небольшие изменения (убрать `instance.`) |
| Масштабируемость на React/Svelte | Через callbacks | Идиоматично, паттерн одинаков |
| Сложность реализации | Высокая | Средняя |
| Отладка | Сложнее (Proxy) | Просто (явные refs) |
| Явность зависимостей | Неявная (автомагия) | Явная (виден каждый `useEventRef`) |
| Риски с edge cases | Высокие | Низкие |

---

## Рекомендуемый порядок

1. **Начать с Approach 2** — меньше рисков, не трогает `core/`, паттерн уже доказан
2. Аудит событий → добавить недостающие `change:X` в core
3. Создать `useComponentViewState` / `useStylableState` / `useControlState`
4. Переписать `TabItem.vue` как пилотный компонент
5. Прогнать все тесты, оценить производительность
6. Если Approach 2 устраивает → пропустить Approach 1
7. Если нет → перейти к Approach 1

---

## Статус

- [ ] Approach 2: реализован пилот (TabItem.vue)
- [ ] Approach 2: аудит событий core завершён
- [ ] Approach 2: performance оценена
- [ ] Approach 1: реализован пилот (если нужно)
- [ ] Финальный выбор сделан
- [ ] Этот файл удалён
