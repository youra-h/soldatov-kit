<script setup lang="ts">
import PropertyField from '../common/PropertyField.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'update:visible': [value: boolean]
	'update:rendered': [value: boolean]
	'update:tag': [value: string]
	change: [props: Props]
}>()

const tags = ['div', 'span', 'section', 'article', 'header', 'footer', 'main', 'aside']

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

const handleTagChange = (event: Event) => {
	const value = (event.target as HTMLSelectElement).value
	emit('update:tag', value)
	emit('change', { ...props, tag: value })
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

		<!-- Tag -->
		<PropertyField label="tag">
			<select :value="tag" @change="handleTagChange" class="properties-panel__select">
				<option v-for="tagOption in tags" :key="tagOption" :value="tagOption">
					{{ tagOption }}
				</option>
			</select>
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

	&__select {
		@apply border rounded;
		@apply px-2 py-1;
		@apply w-60;
	}
}
</style>
