<script setup lang="ts">
type Props = {
	title?: string
	info?: string
}

defineProps<Props>()
</script>

<template>
	<div class="panel-demo">
		<h3 v-if="title" class="panel-demo__title">{{ title }}</h3>
		<div class="panel-demo__content">
			<slot />
		</div>
		<div v-if="info" class="panel-demo__info">{{ info }}</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.panel-demo {
	$this: &;

	@apply p-6 bg-white rounded-lg shadow-sm;

	&__title {
		@apply text-base font-semibold mb-4;
	}

	&__content {
		@apply flex items-center justify-center px-4;
		@apply min-h-[100px];
		@apply border-2 border-dashed border-gray-200 rounded;
	}

	&__info {
		@apply mt-4 text-sm text-gray-500 text-center;
	}
}
</style>
