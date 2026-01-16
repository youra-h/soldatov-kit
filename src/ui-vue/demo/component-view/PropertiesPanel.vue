<script setup lang="ts">
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
		<div class="properties-panel__field">
			<label class="properties-panel__label">visible:</label>
			<input
				type="checkbox"
				:checked="visible"
				@change="handleVisibleChange"
				class="properties-panel__checkbox"
			/>
		</div>

		<!-- Rendered -->
		<div class="properties-panel__field">
			<label class="properties-panel__label">rendered:</label>
			<input
				type="checkbox"
				:checked="rendered"
				@change="handleRenderedChange"
				class="properties-panel__checkbox"
			/>
		</div>

		<!-- Tag -->
		<div class="properties-panel__field properties-panel__field--full">
			<label class="properties-panel__label">tag:</label>
			<select :value="tag" @change="handleTagChange" class="properties-panel__select">
				<option v-for="tagOption in tags" :key="tagOption" :value="tagOption">
					{{ tagOption }}
				</option>
			</select>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.properties-panel {
	$this: &;

	@apply grid grid-cols-2;
	@apply gap-4;

	&__field {
		@apply flex items-center;
		@apply gap-2;

		&--full {
			@apply col-span-2;
		}
	}

	&__label {
		@apply font-medium;
		@apply text-sm;
	}

	&__checkbox {
		@apply w-4 h-4;
	}

	&__select {
		@apply border rounded;
		@apply px-2 py-1;
		@apply flex-1;
	}
}
</style>
