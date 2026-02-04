<!-- @deprecated Используйте общий компонент Properties из common/Properties.vue -->
<script setup lang="ts">
import PropertyField from '../common/PropertyField.vue'
import SizeSelector, { type TComponentSize } from '../common/SizeSelector.vue'
import IconSelector from '../common/IconSelector.vue'
import CheckboxField from '../common/CheckboxField.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
	size?: TComponentSize
	width?: number | string
	height?: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'update:visible': [value: boolean]
	'update:rendered': [value: boolean]
	'update:tag': [value: string]
	'update:size': [value: TComponentSize]
	'update:width': [value: number | string]
	'update:height': [value: number | string]
	change: [props: Props]
	show: []
	hide: []
}>()

const handleTagChange = (value: string) => {
	emit('update:tag', value)
	emit('change', { ...props, tag: value })
}

const handleSizeChange = (value: TComponentSize) => {
	emit('update:size', value)
	emit('change', { ...props, size: value })
}

const handleWidthChange = (event: Event) => {
	const value = (event.target as HTMLInputElement).value
	emit('update:width', value)
	emit('change', { ...props, width: value })
}

const handleHeightChange = (event: Event) => {
	const value = (event.target as HTMLInputElement).value
	emit('update:height', value)
	emit('change', { ...props, height: value })
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

		<!-- Tag (Icon path) -->
		<PropertyField label="tag">
			<IconSelector
				:model-value="tag || '/src/icons/home.svg'"
				@update:model-value="handleTagChange"
			/>
		</PropertyField>

		<!-- Size -->
		<PropertyField label="size">
			<SizeSelector :model-value="size || 'normal'" @update:model-value="handleSizeChange" />
		</PropertyField>

		<!-- Width -->
		<PropertyField label="width">
			<input
				type="text"
				:value="width"
				@input="handleWidthChange"
				class="properties-panel__input"
				placeholder="auto"
			/>
		</PropertyField>

		<!-- Height -->
		<PropertyField label="height">
			<input
				type="text"
				:value="height"
				@input="handleHeightChange"
				class="properties-panel__input"
				placeholder="auto"
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
		@apply w-60;
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
