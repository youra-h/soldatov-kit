<script setup lang="ts">
defineProps<{
	label: string
}>()
</script>

<template>
	<div class="property-field">
		<label class="property-field__label">{{ label }}:</label>
		<div class="property-field__control">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.property-field {
	@apply flex items-center;
	@apply gap-2;

	&__label {
		@apply font-medium;
		@apply text-sm;
		@apply w-30;
	}

	&__control {
		@apply flex-1;
	}
}
</style>
