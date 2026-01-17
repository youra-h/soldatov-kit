<script setup lang="ts">
export type TComponentSize = 'sm' | 'normal' | 'auto' | 'lg' | 'xl' | '2xl'

type Props = {
	modelValue: TComponentSize
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'update:modelValue': [value: TComponentSize]
}>()

const sizes: TComponentSize[] = ['sm', 'normal', 'auto', 'lg', 'xl', '2xl']

const handleChange = (event: Event) => {
	const value = (event.target as HTMLSelectElement).value as TComponentSize
	emit('update:modelValue', value)
}
</script>

<template>
	<select :value="modelValue" @change="handleChange" class="size-selector">
		<option v-for="size in sizes" :key="size" :value="size">
			{{ size }}
		</option>
	</select>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.size-selector {
	@apply border rounded;
	@apply px-2 py-1;
	@apply w-60;
}
</style>
