<script setup lang="ts">
import PropertyField from '../common/PropertyField.vue'
import CheckboxField from '../common/CheckboxField.vue'

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
	show: []
	hide: []
}>()

const tags = ['div', 'span', 'section', 'article', 'header', 'footer', 'main', 'aside']

const handleTagChange = (event: Event) => {
	const value = (event.target as HTMLSelectElement).value
	emit('update:tag', value)
	emit('change', { ...props, tag: value })
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
				@update:model-value="emit('update:visible', $event); emit('change', { ...props, visible: $event })"
			/>
		</PropertyField>

		<!-- Rendered -->
		<PropertyField label="rendered">
			<CheckboxField
				:model-value="rendered || false"
				@update:model-value="emit('update:rendered', $event); emit('change', { ...props, rendered: $event })"
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

		<!-- Actions -->
		<PropertyField label="actions">
			<div class="properties-panel__actions">
				<button @click="handleShow" class="properties-panel__button">
					Show
				</button>
				<button @click="handleHide" class="properties-panel__button">
					Hide
				</button>
			</div>
		</PropertyField>
	</div>
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind/index.css";

.properties-panel {
	@apply flex flex-col;
	@apply gap-4;

	&__select {
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
