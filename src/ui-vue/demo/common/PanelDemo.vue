<script setup lang="ts">
type Props = {
	title?: string
	info?: string
}

defineProps<Props>()
</script>

<template>
	<div class="demo-container">
		<h3 v-if="title" class="demo-title">{{ title }}</h3>
		<div class="demo-content">
			<slot />
		</div>
		<div v-if="info" class="demo-info">{{ info }}</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.demo-container {
	@apply p-6 bg-white rounded-lg shadow-sm;
}

.demo-title {
	@apply text-base font-semibold mb-4;
}

.demo-content {
	@apply flex items-center justify-center;
	@apply min-h-[100px];
	@apply border-2 border-dashed border-gray-200 rounded;
}

.demo-info {
	@apply mt-4 text-sm text-gray-500 text-center;
}
</style>
