<script setup lang="ts">
import { Switch } from '@ui/switch'
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

		<!-- Grid with all sizes and variants (OFF state) -->
		<div class="sizes-demo__subtitle">OFF State</div>
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
					<Switch
						:visible="visible"
						:rendered="rendered"
						:size="size"
						:variant="variant"
						:value="false"
					/>
				</div>
			</div>
		</div>

		<!-- Grid with all sizes and variants (ON state) -->
		<div class="sizes-demo__subtitle">ON State</div>
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
					<Switch
						:visible="visible"
						:rendered="rendered"
						:size="size"
						:variant="variant"
						:value="true"
					/>
				</div>
			</div>
		</div>

		<!-- Custom icons in slots -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__section-title">Custom Icons (Before/After slots)</div>
			<div class="sizes-demo__section-grid">
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Before icon (OFF)</div>
					<Switch
						:visible="visible"
						:rendered="rendered"
						size="lg"
						variant="primary"
						:value="false"
					>
						<template #before>
							<Icon :tag="useIconImport('/src/icons/close.svg')" size="lg" />
						</template>
					</Switch>
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">After icon (ON)</div>
					<Switch
						:visible="visible"
						:rendered="rendered"
						size="lg"
						variant="success"
						:value="true"
					>
						<template #after>
							<Icon :tag="useIconImport('/src/icons/check.svg')" size="lg" />
						</template>
					</Switch>
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Both icons</div>
					<Switch
						:visible="visible"
						:rendered="rendered"
						size="lg"
						variant="danger"
						:value="true"
					>
						<template #before>
							<Icon :tag="useIconImport('/src/icons/close.svg')" size="lg" />
						</template>
						<template #after>
							<Icon :tag="useIconImport('/src/icons/home.svg')" size="lg" />
						</template>
					</Switch>
				</div>
			</div>
		</div>

		<!-- States examples -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__section-title">Special States</div>
			<div class="sizes-demo__section-grid">
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Disabled (OFF)</div>
					<Switch
						:visible="visible"
						:rendered="rendered"
						size="lg"
						variant="primary"
						:value="false"
						:disabled="true"
					/>
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Disabled (ON)</div>
					<Switch
						:visible="visible"
						:rendered="rendered"
						size="lg"
						variant="success"
						:value="true"
						:disabled="true"
					/>
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Readonly</div>
					<Switch
						:visible="visible"
						:rendered="rendered"
						size="lg"
						variant="warning"
						:value="true"
						:readonly="true"
					/>
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

	&__subtitle {
		@apply font-semibold text-base;
		@apply mt-6 mb-2;
		@apply text-gray-800;
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
		@apply text-center;
	}
}
</style>
