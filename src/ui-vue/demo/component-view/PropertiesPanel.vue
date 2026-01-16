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
	'change': [props: Props]
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
	<div class="grid grid-cols-2 gap-4">
		<!-- Visible -->
		<div class="flex items-center gap-2">
			<label class="font-medium text-sm">visible:</label>
			<input
				type="checkbox"
				:checked="visible"
				@change="handleVisibleChange"
				class="w-4 h-4"
			/>
		</div>

		<!-- Rendered -->
		<div class="flex items-center gap-2">
			<label class="font-medium text-sm">rendered:</label>
			<input
				type="checkbox"
				:checked="rendered"
				@change="handleRenderedChange"
				class="w-4 h-4"
			/>
		</div>

		<!-- Tag -->
		<div class="flex items-center gap-2 col-span-2">
			<label class="font-medium text-sm">tag:</label>
			<select
				:value="tag"
				@change="handleTagChange"
				class="border rounded px-2 py-1 flex-1"
			>
				<option v-for="tagOption in tags" :key="tagOption" :value="tagOption">
					{{ tagOption }}
				</option>
			</select>
		</div>
	</div>
</template>
