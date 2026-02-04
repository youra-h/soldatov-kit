<!-- @deprecated Используйте стандартный <input type="checkbox"> напрямую -->
<script setup lang="ts">
type Props = {
	modelValue: boolean
	label?: string
	labelPosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
	labelPosition: 'right',
})

const emit = defineEmits<{
	'update:modelValue': [value: boolean]
}>()

const handleChange = (event: Event) => {
	const value = (event.target as HTMLInputElement).checked
	emit('update:modelValue', value)
}
</script>

<template>
	<label class="checkbox-field" :class="{ 'checkbox-field--left': labelPosition === 'left' }">
		<span v-if="label && labelPosition === 'left'" class="checkbox-field__label">
			{{ label }}
		</span>
		<input
			type="checkbox"
			:checked="modelValue"
			@change="handleChange"
			class="checkbox-field__input"
		/>
		<span v-if="label && labelPosition === 'right'" class="checkbox-field__label">
			{{ label }}
		</span>
	</label>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.checkbox-field {
	@apply flex items-center gap-2 cursor-pointer;

	&--left {
		@apply flex-row-reverse justify-end;
	}

	&__input {
		@apply w-4 h-4;
	}

	&__label {
		@apply text-sm;
	}
}
</style>
