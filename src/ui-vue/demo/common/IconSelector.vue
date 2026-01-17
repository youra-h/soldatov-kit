<script setup lang="ts">
import { ref, computed } from 'vue'

type Props = {
	modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'update:modelValue': [value: string]
}>()

const icons = [
	{ name: 'home', path: '/src/icons/home.svg' },
	{ name: 'check', path: '/src/icons/check.svg' },
	{ name: 'check_indeterminate', path: '/src/icons/check_indeterminate.svg' },
	{ name: 'close', path: '/src/icons/close.svg' },
]

const handleChange = (event: Event) => {
	const value = (event.target as HTMLSelectElement).value
	emit('update:modelValue', value)
}
</script>

<template>
	<select :value="modelValue" @change="handleChange" class="icon-selector">
		<option v-for="icon in icons" :key="icon.path" :value="icon.path">
			{{ icon.name }}
		</option>
	</select>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.icon-selector {
	@apply border rounded;
	@apply px-2 py-1;
	@apply w-60;
}
</style>
