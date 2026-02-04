<script setup lang="ts">
import { computed } from 'vue'
import PropertyField from './PropertyField.vue'

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
	set: (value) => emit('update:spinnerType', value),
})
</script>

<template>
	<div class="loading-control">
		<PropertyField label="loading">
			<input v-model="localLoading" type="checkbox" class="loading-control__checkbox" />
		</PropertyField>

		<div v-if="loading" class="loading-control__options">
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
