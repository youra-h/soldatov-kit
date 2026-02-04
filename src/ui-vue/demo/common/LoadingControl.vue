<script setup lang="ts">
import { computed } from 'vue'

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
		<div class="loading-control__row">
			<label class="loading-control__label">
				<input v-model="localLoading" type="checkbox" class="loading-control__checkbox" />
				<span class="loading-control__label-text">Loading</span>
			</label>
		</div>

		<div v-if="loading" class="loading-control__options">
			<div class="loading-control__row">
				<label class="loading-control__label">
					<input
						v-model="localDisabled"
						type="checkbox"
						class="loading-control__checkbox"
					/>
					<span class="loading-control__label-text">Disable while loading</span>
				</label>
			</div>

			<div class="loading-control__row">
				<label class="loading-control__field-label">Spinner:</label>
				<select v-model="localSpinnerType" class="loading-control__select">
					<option v-for="type in spinnerTypes" :key="type" :value="type">
						{{ type }}
					</option>
				</select>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.loading-control {
	$this: &;

	@apply flex flex-col;
	@apply gap-2;

	&__row {
		@apply flex items-center;
		@apply gap-2;
	}

	&__options {
		@apply pl-6;
		@apply flex flex-col;
		@apply gap-2;
		@apply pt-2;
		@apply border-l-2 border-blue-200;
	}

	&__label {
		@apply flex items-center;
		@apply gap-2;
		@apply cursor-pointer;
	}

	&__label-text {
		@apply text-sm;
		@apply text-gray-700;
	}

	&__checkbox {
		@apply w-4 h-4;
		@apply cursor-pointer;
	}

	&__field-label {
		@apply text-sm;
		@apply text-gray-700;
		@apply font-medium;
		@apply min-w-[80px];
	}

	&__select {
		@apply px-2 py-1;
		@apply text-sm;
		@apply border border-gray-300;
		@apply rounded;
		@apply bg-white;
		@apply flex-1;
	}
}
</style>
