<script setup lang="ts">
import { Icon, useIconImport } from '@ui/icon'
import type { TComponentSize } from '../common/SizeSelector.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
}

const props = defineProps<Props>()

const sizes: TComponentSize[] = ['sm', 'normal', 'auto', 'lg', 'xl', '2xl']
</script>

<template>
	<div class="sizes-demo">
		<div class="sizes-demo__title">All Sizes Demo</div>
		<div class="sizes-demo__grid">
			<div v-for="size in sizes" :key="size" class="sizes-demo__item">
				<div class="sizes-demo__label">{{ size }}</div>
				<Icon
					:tag="useIconImport(tag || '/src/icons/home.svg')"
					:visible="visible"
					:rendered="rendered"
					:size="size"
					class="sizes-demo__icon"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.sizes-demo {
	$this: &;

	@apply border-2 border-purple-500;
	@apply rounded;
	@apply p-4;

	&__title {
		@apply font-semibold;
		@apply mb-4;
		@apply text-center;
	}

	&__grid {
		@apply flex flex-wrap;
		@apply gap-4;
		@apply justify-center;
	}

	&__item {
		@apply flex flex-col items-center;
		@apply gap-2;
		@apply p-2;
		@apply border rounded;
	}

	&__label {
		@apply text-xs;
		@apply text-gray-600;
		@apply font-mono;
	}

	&__icon {
		@apply border border-gray-300;
		@apply rounded;
		@apply p-1;
	}
}
</style>
