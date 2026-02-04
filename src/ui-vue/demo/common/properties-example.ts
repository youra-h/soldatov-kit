/**
 * Пример использования универсального компонента Properties
 * для создания нового Playground компонента
 */

import { ref } from 'vue'
import Properties from './common/Properties.vue'
import type { TPropertiesSchema } from './common/Properties.vue'
import { SIZES, VARIANTS } from './common/items'

// 1. Определяем схему свойств компонента
const propertiesSchema: TPropertiesSchema = {
	// Boolean свойства → checkbox
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	disabled: { type: 'boolean', default: false },

	// Select свойства → выпадающий список
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },

	// String свойства → текстовый input
	text: { type: 'string', default: 'Button', placeholder: 'Enter text' },

	// Number свойства → number input
	width: { type: 'number', placeholder: 'auto' },
}

// 2. Создаем reactive состояние (initial values должны совпадать с default в схеме)
const componentProps = ref({
	visible: true,
	rendered: true,
	disabled: false,
	size: 'normal',
	variant: 'normal',
	text: 'Button',
	width: undefined,
})

// 3. Используем в template
/*
<template>
	<PlaygroundLayout title="My Component Playground">
		<template #properties>
			<Properties
				v-model="componentProps"
				:schema="propertiesSchema"
			/>
		</template>

		<template #props-demo>
			<MyComponent v-bind="componentProps" />
		</template>
	</PlaygroundLayout>
</template>
*/

/**
 * ВАЖНО:
 * - Если есть свойство 'visible' в схеме, автоматически появятся кнопки Show/Hide
 * - Для обработки show/hide на instance можно использовать emit:
 *   @show="instanceRef?.show()" @hide="instanceRef?.hide()"
 * - Все изменения свойств автоматически отражаются через v-model
 * - Не нужно создавать отдельный компонент Properties для каждого playground!
 */
