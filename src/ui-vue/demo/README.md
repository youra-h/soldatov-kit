# Component Playground

Структура playground для тестирования и демонстрации компонентов.

## Структура файлов

```
demo/
├── PlaygroundLayout.vue          # Базовый layout с 3 строками
├── EventLog.vue                  # Компонент для отображения логов событий
├── ComponentViewPlayground.vue   # Главный компонент для ComponentView
├── component-view/               # Папка с компонентами для ComponentView
│   ├── PropertiesPanel.vue      # Панель свойств компонента
│   ├── PropsDemo.vue            # Демо с передачей props
│   ├── InstanceDemo.vue         # Демо с передачей instance
│   └── SlotsDemo.vue            # Демо различных вариантов слотов
└── AppComponentView.vue         # Точка входа
```

## Компоненты

### PlaygroundLayout
Базовый layout с тремя строками:
1. **Properties** - панель свойств компонента
2. **Demo** - три столбца для демонстрации (Props Demo, Instance Demo, Slots Demo)
3. **Event Log** - лог событий

### EventLog
Компонент для отображения событий с:
- Временными метками
- Типом источника события (props, instance, core, vue)
- Названием события
- Payload (если есть)

### PropertiesPanel
Панель управления свойствами компонента:
- Boolean свойства → чекбоксы
- String свойства → текстовые поля
- Enum свойства → выпадающие списки

### PropsDemo
Первый столбец демонстрации:
- Компонент получает свойства через props
- Логирует все Vue события компонента

### InstanceDemo
Второй столбец демонстрации:
- Компонент получает instance
- Логирует события и от instance (core), и от компонента (vue)
- Синхронизируется со свойствами из панели

### SlotsDemo
Третий столбец демонстрации:
- Статические примеры использования слотов
- Различные варианты контента
- Демонстрация корректности отображения

## Обмен данными

1. **PropertiesPanel** → emit('change', props) → **ComponentViewPlayground**
2. **ComponentViewPlayground** → v-bind → **PropsDemo** / **InstanceDemo** / **SlotsDemo**
3. **PropsDemo** / **InstanceDemo** → emit('log', entry) → **ComponentViewPlayground**
4. **ComponentViewPlayground** → **EventLog**

## Использование

```vue
<template>
  <ComponentViewPlayground />
</template>
```

## Добавление нового компонента

Для добавления playground для нового компонента:

1. Создать папку `demo/<component-name>/`
2. Создать компоненты:
   - `PropertiesPanel.vue` - панель свойств
   - `PropsDemo.vue` - демо с props
   - `InstanceDemo.vue` - демо с instance
   - `SlotsDemo.vue` - демо слотов
3. Создать главный файл `<ComponentName>Playground.vue`
4. Импортировать и использовать `PlaygroundLayout` и `EventLog`
