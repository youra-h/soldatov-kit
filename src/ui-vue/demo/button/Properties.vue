<script setup lang="ts">
import { computed } from 'vue'
import PropertyField from '../common/PropertyField.vue'
import SizeSelector from '../common/SizeSelector.vue'
import VariantSelector from '../common/VariantSelector.vue'
import IconSelector from '../common/IconSelector.vue'
import type { TComponentSize } from '../common/SizeSelector.vue'
import type { TComponentVariant } from '../common/VariantSelector.vue'
import type { TButtonAppearance } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	appearance?: TButtonAppearance
	disabled?: boolean
	loading?: boolean
	loadingShouldDisable?: boolean
	spinnerType?: 'default' | 'small' | 'large' | 'primary' | 'danger'
	text?: string
	icon?: string
}

const props = withDefaults(defineProps<Props>(), {
	visible: true,
	rendered: true,
	size: 'normal',
	variant: 'normal',
	appearance: 'normal',
	disabled: false,
	loading: false,
	loadingShouldDisable: true,
	spinnerType: 'default',
	text: 'Button',
	icon: '',
})

const emit = defineEmits<{
	change: [newProps: Partial<Props>]
	show: []
	hide: []
}>()

const appearances: TButtonAppearance[] = ['normal', 'plain', 'outlined']

const spinnerTypes = [
	{ value: 'default', label: 'Default (auto)' },
	{ value: 'small', label: 'Small spinner' },
	{ value: 'large', label: 'Large spinner' },
	{ value: 'primary', label: 'Primary spinner' },
	{ value: 'danger', label: 'Danger spinner' },
]

const handleChange = (key: keyof Props, value: any) => {
	emit('change', { [key]: value })
}

const visibleLabel = computed(() => (props.visible ? 'Hide' : 'Show'))
const renderedLabel = computed(() => (props.rendered ? 'Unrender' : 'Render'))
</script>

<template>
	<div class="properties-panel">
		<h3 class="properties-panel__title">Properties</h3>

		<div class="properties-panel__section">
			<h4 class="properties-panel__section-title">Visibility</h4>
			<PropertyField label="visible" :model-value="visible">
				<div class="properties-panel__button-group">
					<button
						class="properties-panel__button"
						:class="{ 'properties-panel__button--active': visible }"
						@click="$emit('show')"
					>
						Show
					</button>
					<button
						class="properties-panel__button"
						:class="{ 'properties-panel__button--active': !visible }"
						@click="$emit('hide')"
					>
						Hide
					</button>
				</div>
			</PropertyField>

			<PropertyField label="rendered" :model-value="rendered">
				<button class="properties-panel__button" @click="handleChange('rendered', !rendered)">
					{{ renderedLabel }}
				</button>
			</PropertyField>
		</div>

		<div class="properties-panel__section">
			<h4 class="properties-panel__section-title">Style</h4>

			<PropertyField label="size" :model-value="size">
				<SizeSelector :model-value="size" @update:model-value="handleChange('size', $event)" />
			</PropertyField>

			<PropertyField label="variant" :model-value="variant">
				<VariantSelector :model-value="variant" @update:model-value="handleChange('variant', $event)" />
			</PropertyField>

			<PropertyField label="appearance" :model-value="appearance">
				<select
					:value="appearance"
					@change="handleChange('appearance', ($event.target as HTMLSelectElement).value)"
					class="properties-panel__select"
				>
					<option v-for="app in appearances" :key="app" :value="app">
						{{ app }}
					</option>
				</select>
			</PropertyField>
		</div>

		<div class="properties-panel__section">
			<h4 class="properties-panel__section-title">Content</h4>

			<PropertyField label="text" :model-value="text">
				<input
					type="text"
					:value="text"
					@input="handleChange('text', ($event.target as HTMLInputElement).value)"
					class="properties-panel__input"
				/>
			</PropertyField>

			<PropertyField label="icon" :model-value="icon">
				<IconSelector :model-value="icon" @update:model-value="handleChange('icon', $event)" />
			</PropertyField>
		</div>

		<div class="properties-panel__section">
			<h4 class="properties-panel__section-title">State</h4>

			<PropertyField label="disabled" :model-value="disabled">
				<label class="properties-panel__checkbox">
					<input
						type="checkbox"
						:checked="disabled"
						@change="handleChange('disabled', ($event.target as HTMLInputElement).checked)"
					/>
					<span>Disabled</span>
				</label>
			</PropertyField>

			<PropertyField label="loading" :model-value="loading">
				<label class="properties-panel__checkbox">
					<input
						type="checkbox"
						:checked="loading"
						@change="handleChange('loading', ($event.target as HTMLInputElement).checked)"
					/>
					<span>Loading</span>
				</label>
			</PropertyField>

			<template v-if="loading">
				<PropertyField label="  ↳ shouldDisable" :model-value="loadingShouldDisable" class="properties-panel__nested">
					<label class="properties-panel__checkbox">
						<input
							type="checkbox"
							:checked="loadingShouldDisable"
							@change="handleChange('loadingShouldDisable', ($event.target as HTMLInputElement).checked)"
						/>
						<span>Disable when loading</span>
					</label>
				</PropertyField>

				<PropertyField label="  ↳ spinner" :model-value="spinnerType" class="properties-panel__nested">
					<select
						:value="spinnerType"
						@change="handleChange('spinnerType', ($event.target as HTMLSelectElement).value)"
						class="properties-panel__select"
					>
						<option v-for="type in spinnerTypes" :key="type.value" :value="type.value">
							{{ type.label }}
						</option>
					</select>
				</PropertyField>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.properties-panel {
	@apply p-4 bg-white rounded-lg shadow-sm;

	&__title {
		@apply text-lg font-semibold mb-4;
	}

	&__section {
		@apply mb-6;

		&:last-child {
			@apply mb-0;
		}
	}

	&__section-title {
		@apply text-sm font-medium text-gray-700 mb-3;
	}

	&__button-group {
		@apply flex gap-2;
	}

	&__button {
		@apply px-3 py-1.5 rounded;
		@apply bg-gray-100 hover:bg-gray-200;
		@apply text-sm;
		@apply transition-colors;

		&--active {
			@apply bg-blue-500 text-white;
			@apply hover:bg-blue-600;
		}
	}

	&__select {
		@apply w-full px-2 py-1.5 rounded;
		@apply border border-gray-300;
		@apply text-sm;
		@apply focus:outline-none focus:ring-2 focus:ring-blue-500;
	}

	&__input {
		@apply w-full px-2 py-1.5 rounded;
		@apply border border-gray-300;
		@apply text-sm;
		@apply focus:outline-none focus:ring-2 focus:ring-blue-500;
	}

	&__checkbox {
		@apply flex items-center gap-2 cursor-pointer;

		input[type="checkbox"] {
			@apply w-4 h-4;
		}

		span {
			@apply text-sm;
		}
	}

	&__nested {
		@apply ml-4 opacity-90;
	}
}
</style>
