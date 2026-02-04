# Упрощенная система демо компонентов

## Что изменилось

### 1. Общий компонент Properties

Вместо создания отдельного `Properties.vue` для каждого компонента, теперь используется один универсальный компонент:

- **Файл:** `src/ui-vue/demo/common/Properties.vue`
- **Принцип:** Автоматически генерирует поля на основе схемы свойств

### 2. Централизованные списки

Все общие списки (размеры, варианты, теги и т.д.) вынесены в:

- **Файл:** `src/ui-vue/demo/common/items.ts`
- **Преимущество:** Нет дублирования, легко добавлять новые опции

### 3. Упрощенный CheckboxField

Вместо кастомного компонента используется стандартный `<input type="checkbox">`

### 4. Общий компонент PanelDemo ✨ НОВОЕ

Все демо-компоненты (Component.vue, Instance.vue, Slots.vue) теперь используют универсальный `PanelDemo.vue` для оформления:

- **Файл:** `src/ui-vue/demo/common/PanelDemo.vue`
- **Принцип:** Единообразное оформление всех демо-панелей
- **Преимущество:** Не нужно дублировать стили в каждом Component/Instance/Slots

## Пример использования

### Старый подход (deprecated)

```vue
<script setup lang="ts">
import PropertiesPanel from './component-view/Properties.vue'

const componentProps = ref({ visible: true, rendered: true, tag: 'div' })
const handlePropsChange = (newProps) => {
    componentProps.value = { ...componentProps.value, ...newProps }
}
</script>

<template>
    <PropertiesPanel v-bind="componentProps" @change="handlePropsChange" />
</template>
```

### Новый подход ✅

```vue
<script setup lang="ts">
import Properties from './common/Properties.vue'
import type { TPropertiesSchema } from './common/Properties.vue'
import { HTML_TAGS } from './common/items'

// Описываем схему свойств
const propertiesSchema: TPropertiesSchema = {
    visible: { type: 'boolean', default: true },
    rendered: { type: 'boolean', default: true },
    tag: { type: 'select', default: 'div', options: HTML_TAGS },
}

// Состояние компонента
const componentProps = ref({ visible: true, rendered: true, tag: 'div' })
</script>

<template>
    <Properties v-model="componentProps" :schema="propertiesSchema" />
</template>
```

## Типы полей в схеме

### Boolean

```typescript
{ type: 'boolean', default: true }
```

→ Генерирует `<input type="checkbox">`

### String / Number

```typescript
{ type: 'string', placeholder: 'Enter text' }
{ type: 'number', default: 0 }
```

→ Генерирует `<input type="text">` или `<input type="number">`

### Select (выпадающий список)

```typescript
// Простой массив
{ type: 'select', options: ['option1', 'option2', 'option3'] }

// С метками
{
  type: 'select',
  options: [
    { value: 'sm', label: 'Small' },
    { value: 'lg', label: 'Large' }
  ]
}
```

→ Генерирует `<select>`

## Добавление новых свойств

1. **Добавить список в `items.ts`** (если нужен):

```typescript
export const MY_OPTIONS = ['option1', 'option2']
```

2. **Определить схему в Playground**:

```typescript
const propertiesSchema: TPropertiesSchema = {
    myProp: { type: 'select', default: 'option1', options: MY_OPTIONS },
}
```

3. **Добавить в состояние**:

```typescript
const componentProps = ref({
    myProp: 'option1',
})
```

Всё! Поле автоматически появится в панели свойств.

## Пример использования PanelDemo

### Старый подход (с кастомными стилями) ✗

```vue
<template>
    <div class="demo-container">
        <h3 class="demo-title">Component (props)</h3>
        <div class="demo-content">
            <MyComponent v-bind="props" />
        </div>
        <div class="demo-info">Some info</div>
    </div>
</template>

<style>
.demo-container {
    /* много дублированных стилей */
}
.demo-title {
    /* ... */
}
.demo-content {
    /* ... */
}
.demo-info {
    /* ... */
}
</style>
```

### Новый подход ✅

```vue
<script setup>
import PanelDemo from '../common/PanelDemo.vue'
</script>

<template>
    <PanelDemo title="Component (props)" info="Some info">
        <MyComponent v-bind="props" />
    </PanelDemo>
</template>
<!-- Стилей нет - все в PanelDemo! -->
```

## Deprecated компоненты

Следующие компоненты помечены как deprecated и будут удалены в будущем:

- ✗ `src/ui-vue/demo/component-view/Properties.vue`
- ✗ `src/ui-vue/demo/icon/Properties.vue`
- ✗ `src/ui-vue/demo/button/Properties.vue`
- ✗ `src/ui-vue/demo/spinner/Properties.vue`
- ✗ `src/ui-vue/demo/common/CheckboxField.vue`

**Используйте вместо них:**

- `src/ui-vue/demo/common/Properties.vue` - для панели свойств
- `src/ui-vue/demo/common/PanelDemo.vue` - для оформления демо-секций

## Преимущества нового подхода

1. ✅ **Меньше кода** - не нужно создавать компонент для каждого playground
2. ✅ **Легче поддерживать** - изменения в одном месте
3. ✅ **Простота** - декларативное описание схемы
4. ✅ **Нет дублирования** - списки в одном файле, стили в PanelDemo
5. ✅ **Стандартные элементы** - используем нативный checkbox вместо кастомного
6. ✅ **Чистый код** - Component.vue, Instance.vue, Slots.vue без стилей
