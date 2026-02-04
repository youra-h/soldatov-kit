<!-- @deprecated Используйте общий компонент Properties из common/Properties.vue -->
<script setup lang="ts">
import PropertyField from '../common/PropertyField.vue'
import SizeSelector, { type TComponentSize } from '../common/SizeSelector.vue'
import VariantSelector, { type TComponentVariant } from '../common/VariantSelector.vue'
import CheckboxField from '../common/CheckboxField.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'update:visible': [value: boolean]
	'update:rendered': [value: boolean]
	'update:size': [value: TComponentSize]
	'update:variant': [value: TComponentVariant]
	change: [props: Props]
	show: []
	hide: []
}>()

const handleSizeChange = (value: TComponentSize) => {
	emit('update:size', value)
	emit('change', { ...props, size: value })
}

const handleVariantChange = (value: TComponentVariant) => {
	emit('update:variant', value)
	emit('change', { ...props, variant: value })
}

const handleShow = () => {
	emit('show')
}

const handleHide = () => {
	emit('hide')
}
</script>

<template>
	<div class="properties-panel">
		<!-- Visible -->
		<PropertyField label="visible">
			<CheckboxField
				:model-value="visible || false"
				@update:model-value="
					emit('update:visible', $event)
					emit('change', { ...props, visible: $event })
				"
			/>
		</PropertyField>

		<!-- Rendered -->
		<PropertyField label="rendered">
			<CheckboxField
				:model-value="rendered || false"
				@update:model-value="
					emit('update:rendered', $event)
					emit('change', { ...props, rendered: $event })
				"
			/>
		</PropertyField>

		<!-- Size -->
		<PropertyField label="size">
			<SizeSelector :model-value="size || 'normal'" @update:model-value="handleSizeChange" />
		</PropertyField>

		<!-- Variant -->
		<PropertyField label="variant">
			<VariantSelector
				:model-value="variant || 'normal'"
				@update:model-value="handleVariantChange"
			/>
		</PropertyField>

		<!-- Actions -->
		<PropertyField label="actions">
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

	&__input {
		@apply border rounded;
		@apply px-2 py-1;
		@apply w-full;
	}

	&__actions {
		@apply flex gap-2;
	}

	&__button {
		@apply px-4 py-2;
		@apply bg-blue-500 text-white;
		@apply rounded;
		@apply hover:bg-blue-600;
		@apply transition-colors;

		&:active {
			@apply bg-blue-700;
		}
	}
}
</style>
