<script setup lang="ts">
import { CheckBox } from '@ui/check-box'
import { Icon, useIconImport } from '@ui/icon'
import { SIZES, VARIANTS } from '../../common/items'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
}

const props = defineProps<Props>()

const sizes: TComponentSize[] = SIZES
const variants: TComponentVariant[] = VARIANTS
</script>

<template>
	<div class="sizes-demo">
		<div class="sizes-demo__title">All Sizes & Variants Demo</div>

		<!-- Grid with all sizes and variants -->
		<div class="sizes-demo__grid">
			<div class="sizes-demo__grid-header">
				<div class="sizes-demo__grid-cell sizes-demo__grid-cell--header">
					Size / Variant
				</div>
				<div
					v-for="variant in variants"
					:key="variant"
					class="sizes-demo__grid-cell sizes-demo__grid-cell--header"
				>
					{{ variant }}
				</div>
			</div>

			<div v-for="size in sizes" :key="size" class="sizes-demo__grid-row">
				<div class="sizes-demo__grid-cell sizes-demo__grid-cell--label">
					{{ size }}
				</div>
				<div v-for="variant in variants" :key="variant" class="sizes-demo__grid-cell">
					<CheckBox
						:visible="visible"
						:rendered="rendered"
						:size="size"
						:variant="variant"
						:value="true"
					/>
				</div>
			</div>
		</div>

		<!-- Indeterminate state -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__section-title">Indeterminate State</div>
			<div class="sizes-demo__section-grid">
				<div v-for="size in sizes" :key="size" class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">{{ size }}</div>
					<CheckBox
						:visible="visible"
						:rendered="rendered"
						:size="size"
						variant="primary"
						:value="false"
						:indeterminate="true"
					/>
				</div>
			</div>
		</div>

		<!-- Plain style -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__section-title">Plain Style</div>
			<div class="sizes-demo__section-grid">
				<div v-for="size in sizes" :key="size" class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">{{ size }}</div>
					<CheckBox
						:visible="visible"
						:rendered="rendered"
						:size="size"
						variant="success"
						:value="true"
						:plain="true"
					/>
				</div>
			</div>
		</div>

		<!-- Custom icons -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__section-title">Custom Icons</div>
			<div class="sizes-demo__section-grid">
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Custom check icon</div>
					<CheckBox
						:visible="visible"
						:rendered="rendered"
						size="lg"
						variant="primary"
						:value="true"
					>
						<template #icon>
							<Icon :tag="useIconImport('/src/icons/home.svg')" size="lg" />
						</template>
					</CheckBox>
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Custom indeterminate</div>
					<CheckBox
						:visible="visible"
						:rendered="rendered"
						size="lg"
						variant="danger"
						:value="false"
						:indeterminate="true"
					>
						<template #indeterminate-icon>
							<Icon :tag="useIconImport('/src/icons/close.svg')" size="lg" />
						</template>
					</CheckBox>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@reference "./../../../../foundation/tailwind/index.css";

.sizes-demo {
	$this: &;

	&__title {
		@apply font-semibold text-lg;
		@apply mb-4;
		@apply text-center;
	}

	&__grid {
		@apply mb-8;
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
	}

	&__grid-cell {
		@apply flex items-center justify-center;
		@apply px-2;

		&--header {
			@apply font-semibold text-sm;
			@apply text-gray-700;
		}

		&--label {
			@apply font-medium text-sm;
			@apply text-gray-600;
			@apply justify-start;
		}
	}

	&__section {
		@apply mb-6;
	}

	&__section-title {
		@apply font-semibold text-base;
		@apply mb-3;
		@apply text-gray-800;
	}

	&__section-grid {
		@apply grid grid-cols-3 gap-4;
		@apply md:grid-cols-4 lg:grid-cols-6;
	}

	&__section-item {
		@apply flex flex-col items-center gap-2;
	}

	&__section-label {
		@apply text-xs text-gray-600;
	}
}
</style>
