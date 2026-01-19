<script setup lang="ts">
import { Spinner } from '@ui/spinner'
import { Icon, useIconImport } from '@ui/icon'
import type { TComponentSize } from '../common/SizeSelector.vue'
import type { TComponentVariant } from '../common/VariantSelector.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
}

const props = defineProps<Props>()

const sizes: TComponentSize[] = ['sm', 'normal', 'lg', 'xl', '2xl']
const variants: TComponentVariant[] = ['normal', 'primary', 'secondary', 'success', 'danger', 'warning']
</script>

<template>
	<div class="sizes-demo">
		<div class="sizes-demo__title">All Sizes & Variants Demo</div>

		<!-- Grid with all sizes and variants -->
		<div class="sizes-demo__grid">
			<div class="sizes-demo__grid-header">
				<div class="sizes-demo__grid-cell sizes-demo__grid-cell--header">Size / Variant</div>
				<div
					v-for="variant in variants"
					:key="variant"
					class="sizes-demo__grid-cell sizes-demo__grid-cell--header"
				>
					{{ variant }}
				</div>
			</div>

			<div
				v-for="size in sizes"
				:key="size"
				class="sizes-demo__grid-row"
			>
				<div class="sizes-demo__grid-cell sizes-demo__grid-cell--label">
					{{ size }}
				</div>
				<div
					v-for="variant in variants"
					:key="variant"
					class="sizes-demo__grid-cell"
				>
					<Spinner
						:visible="visible"
						:rendered="rendered"
						:size="size"
						:variant="variant"
					/>
				</div>
			</div>
		</div>

		<!-- Slot demo -->
		<div class="sizes-demo__slot-section">
			<div class="sizes-demo__slot-title">Spinner with Slot (Icon inside)</div>
			<div class="sizes-demo__slot-grid">
				<div v-for="size in sizes" :key="size" class="sizes-demo__slot-item">
					<div class="sizes-demo__slot-label">{{ size }}</div>
					<Spinner
						:visible="visible"
						:rendered="rendered"
						:size="size"
						variant="primary"
						class="sizes-demo__spinner-with-slot"
					>
						<Icon
							:tag="useIconImport('/src/icons/home.svg')"
							:size="size"
							class="sizes-demo__slot-icon"
						/>
					</Spinner>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind/index.css";

.sizes-demo {
	$this: &;

	@apply border-2 border-purple-500;
	@apply rounded;
	@apply p-4;

	&__title {
		@apply font-semibold text-lg;
		@apply mb-4;
		@apply text-center;
	}

	&__grid {
		@apply mb-6;
	}

	&__grid-header {
		@apply grid;
		@apply border-b-2 border-gray-300;
		@apply mb-2 pb-2;
		grid-template-columns: 120px repeat(6, 1fr);
	}

	&__grid-row {
		@apply grid;
		@apply border-b border-gray-200;
		@apply py-2;
		grid-template-columns: 120px repeat(6, 1fr);

		&:last-child {
			@apply border-b-0;
		}
	}

	&__grid-cell {
		@apply flex items-center justify-center;
		@apply p-2;

		&--header {
			@apply font-semibold text-sm;
			@apply text-gray-700;
		}

		&--label {
			@apply font-mono text-sm;
			@apply text-gray-600;
			@apply justify-start;
		}
	}

	&__slot-section {
		@apply mt-6;
		@apply pt-6;
		@apply border-t-2 border-gray-300;
	}

	&__slot-title {
		@apply font-semibold;
		@apply mb-4;
		@apply text-center;
	}

	&__slot-grid {
		@apply flex flex-wrap;
		@apply gap-4;
		@apply justify-center;
	}

	&__slot-item {
		@apply flex flex-col items-center;
		@apply gap-2;
		@apply p-3;
		@apply border rounded;
		@apply bg-gray-50;
	}

	&__slot-label {
		@apply text-xs;
		@apply text-gray-600;
		@apply font-mono;
	}

	&__spinner-with-slot {
		@apply relative;
		@apply flex items-center justify-center;
	}

	&__slot-icon {
		@apply absolute;
		@apply text-blue-600;
	}
}
</style>
