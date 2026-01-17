<script setup lang="ts">
import PropertyField from '../common/PropertyField.vue'
import SizeSelector, { type TComponentSize } from '../common/SizeSelector.vue'
import IconSelector from '../common/IconSelector.vue'

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
}>()

const handleVisibleChange = (event: Event) => {
	const value = (event.target as HTMLInputElement).checked
	emit('update:visible', value)
	emit('change', { ...props, visible: value })
}

const handleRenderedChange = (event: Event) => {
	const value = (event.target as HTMLInputElement).checked
	emit('update:rendered', value)
	emit('change', { ...props, rendered: value })
}

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
</script>

<template>
	<div class="properties-panel">
		<!-- Visible -->
		<PropertyField label="visible">
			<input
				type="checkbox"
				:checked="visible"
				@change="handleVisibleChange"
				class="properties-panel__checkbox"
			/>
		</PropertyField>

		<!-- Rendered -->
		<PropertyField label="rendered">
			<input
				type="checkbox"
				:checked="rendered"
				@change="handleRenderedChange"
				class="properties-panel__checkbox"
			/>
		</PropertyField>

		<!-- Tag (Icon path) -->
		<PropertyField label="tag">
			<IconSelector :model-value="tag || '/src/icons/home.svg'" @update:model-value="handleTagChange" />
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
	</div>
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind/index.css";

.properties-panel {
	@apply flex flex-col;
	@apply gap-4;

	&__checkbox {
		@apply w-4 h-4;
	}

	&__input {
		@apply border rounded;
		@apply px-2 py-1;
		@apply w-60;
	}
}
</style>
