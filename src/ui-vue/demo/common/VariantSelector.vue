<script setup lang="ts">
export type TComponentVariant =
	| 'normal'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning'

type Props = {
	modelValue: TComponentVariant
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'update:modelValue': [value: TComponentVariant]
}>()

const variants: TComponentVariant[] = [
	'normal',
	'primary',
	'secondary',
	'success',
	'danger',
	'warning',
]

const handleChange = (event: Event) => {
	const value = (event.target as HTMLSelectElement).value as TComponentVariant
	emit('update:modelValue', value)
}
</script>

<template>
	<select :value="modelValue" @change="handleChange" class="variant-selector">
		<option v-for="variant in variants" :key="variant" :value="variant">
			{{ variant }}
		</option>
	</select>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.variant-selector {
	@apply border rounded;
	@apply px-2 py-1;
	@apply w-60;
}
</style>
