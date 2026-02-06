<script setup lang="ts">
import { computed, h } from 'vue'
import PropertyField from './PropertyField.vue'
import { Spinner } from '@ui/spinner'
import type { TComponentSize, TComponentVariant } from '@core'
import type { VNode } from 'vue'

type SpinnerType = 'none' | 'default' | 'small' | 'large' | 'primary' | 'danger'

type Props = {
	loading: boolean
	disabled?: boolean
	spinnerType?: SpinnerType
}

type Emits = {
	'update:loading': [value: boolean]
	'update:disabled': [value: boolean]
	'update:spinnerType': [value: SpinnerType]
	'update:spinner': [value: VNode | null]
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
	disabled: true,
	spinnerType: 'default',
})

const emit = defineEmits<Emits>()

const spinnerTypes: SpinnerType[] = ['none', 'default', 'small', 'large', 'primary', 'danger']

const localLoading = computed({
	get: () => props.loading,
	set: (value) => emit('update:loading', value),
})

const localDisabled = computed({
	get: () => props.disabled,
	set: (value) => emit('update:disabled', value),
})

const localSpinnerType = computed({
	get: () => props.spinnerType,
	set: (value) => {
		emit('update:spinnerType', value)
		emit('update:spinner', createSpinner(value))
	},
})

// Создаем Spinner компонент на основе типа
const createSpinner = (type: SpinnerType): VNode | null => {
	if (type === 'none') return null

	const spinnerConfig: Record<string, { size?: TComponentSize; variant?: TComponentVariant }> = {
		default: {},
		small: { size: 'sm' },
		large: { size: 'lg' },
		primary: { variant: 'primary' },
		danger: { variant: 'danger' },
	}

	const config = spinnerConfig[type]
	return h(Spinner, config)
}

// Эмитим начальный spinner при монтировании
if (props.loading && props.spinnerType) {
	emit('update:spinner', createSpinner(props.spinnerType))
}
</script>

<template>
	<div class="loading-control">
		<PropertyField label="loading">
			<input v-model="localLoading" type="checkbox" class="loading-control__checkbox" />
		</PropertyField>

		<div class="loading-control__options">
			<PropertyField label="disabled">
				<input v-model="localDisabled" type="checkbox" class="loading-control__checkbox" />
			</PropertyField>

			<PropertyField label="spinner">
				<select v-model="localSpinnerType" class="loading-control__select">
					<option v-for="type in spinnerTypes" :key="type" :value="type">
						{{ type }}
					</option>
				</select>
			</PropertyField>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.loading-control {
	@apply flex flex-col;
	@apply gap-4;

	&__options {
		@apply pl-6;
		@apply flex flex-col;
		@apply gap-4;
		@apply pt-2;
		@apply border-l-2 border-blue-200;
	}

	&__checkbox {
		@apply w-5 h-5;
		@apply cursor-pointer;
	}

	&__select {
		@apply border rounded;
		@apply px-2 py-1;
		@apply w-60;
	}
}
</style>
