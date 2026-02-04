<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'
import PropertyField from './PropertyField.vue'
import { SIZES, VARIANTS, HTML_TAGS, ICON_PATHS } from './items'
import type { TComponentSize, TComponentVariant } from './items'

/**
 * Универсальный компонент Properties для демо playground'ов.
 * Автоматически генерирует поля на основе определения свойств.
 */

export type TPropertyType = 'boolean' | 'string' | 'number' | 'select'

export interface IPropertyDefinition {
	/** Тип поля */
	type: TPropertyType
	/** Значение по умолчанию */
	default?: any
	/** Опции для select */
	options?: Array<{ value: any; label?: string }> | any[]
	/** Плейсхолдер для input */
	placeholder?: string
	/** Является ли это действием (кнопка show/hide) */
	isAction?: boolean
}

export type TPropertiesSchema = Record<string, IPropertyDefinition>

type Props = {
	/** Текущие значения свойств */
	modelValue: T
	/** Схема свойств (описание полей) */
	schema: TPropertiesSchema
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'update:modelValue': [value: T]
	show: []
	hide: []
}>()

/** Обновление одного свойства */
const updateProperty = (key: string, value: any) => {
	emit('update:modelValue', { ...props.modelValue, [key]: value })
}

/** Показать компонент */
const handleShow = () => {
	updateProperty('visible', true)
	emit('show')
}

/** Скрыть компонент */
const handleHide = () => {
	updateProperty('visible', false)
	emit('hide')
}

/** Получить значение или дефолт */
const getValue = (key: string) => {
	return props.modelValue[key] ?? props.schema[key]?.default
}

/** Проверка, должны ли быть кнопки show/hide */
const hasVisibilityActions = computed(() => {
	return 'visible' in props.schema
})
</script>

<template>
	<div class="properties-panel">
		<!-- Генерируем поля на основе схемы -->
		<template v-for="(def, key) in schema" :key="key">
			<!-- Boolean: checkbox -->
			<PropertyField v-if="def.type === 'boolean'" :label="String(key)">
				<input
					type="checkbox"
					:checked="getValue(key)"
					@change="updateProperty(key, ($event.target as HTMLInputElement).checked)"
					class="properties-panel__checkbox"
				/>
			</PropertyField>

			<!-- String/Number: input -->
			<PropertyField
				v-else-if="def.type === 'string' || def.type === 'number'"
				:label="String(key)"
			>
				<input
					:type="def.type === 'number' ? 'number' : 'text'"
					:value="getValue(key)"
					@input="updateProperty(key, ($event.target as HTMLInputElement).value)"
					:placeholder="def.placeholder"
					class="properties-panel__input"
				/>
			</PropertyField>

			<!-- Select: выпадающий список -->
			<PropertyField v-else-if="def.type === 'select' && def.options" :label="String(key)">
				<select
					:value="getValue(key)"
					@change="updateProperty(key, ($event.target as HTMLSelectElement).value)"
					class="properties-panel__select"
				>
					<option
						v-for="(option, idx) in def.options"
						:key="idx"
						:value="typeof option === 'object' ? option.value : option"
					>
						{{ typeof option === 'object' && option.label ? option.label : option }}
					</option>
				</select>
			</PropertyField>
		</template>

		<!-- Actions: show/hide кнопки -->
		<PropertyField v-if="hasVisibilityActions" label="actions">
			<div class="properties-panel__actions">
				<button @click="handleShow" class="properties-panel__button">Show</button>
				<button @click="handleHide" class="properties-panel__button">Hide</button>
			</div>
		</PropertyField>
	</div>
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind/index.css";

.properties-panel {
	@apply flex flex-col;
	@apply gap-4;

	&__input,
	&__select {
		@apply border rounded;
		@apply px-2 py-1;
		@apply w-60;
	}

	&__checkbox {
		@apply w-5 h-5;
		@apply cursor-pointer;
	}

	&__actions {
		@apply flex gap-2;
	}

	&__button {
		@apply border rounded;
		@apply px-3 py-1;
		@apply bg-blue-500 text-white;
		@apply hover:bg-blue-600;
		@apply transition-colors;
	}
}
</style>
