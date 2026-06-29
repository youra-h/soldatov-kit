<script setup lang="ts">
import { Skeleton } from '@ui/skeleton'
import { Button } from '@ui/button'
import { CheckBox } from '@ui/check-box'
import { Switch } from '@ui/switch'
import { SIZES, VARIANTS } from '../../common/items'
import type { TComponentSize, TComponentVariant, TSkeletonShape, TSkeletonAnimation } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
}

const props = defineProps<Props>()

const sizes: TComponentSize[] = SIZES
const variants: TComponentVariant[] = VARIANTS
const shapes: TSkeletonShape[] = ['rect', 'rounded', 'circle']
const animations: TSkeletonAnimation[] = ['pulse', 'wave', 'none']
</script>

<template>
	<div class="sizes-demo">
		<!-- Grid: sizes × variants -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__title">Sizes × Variants (rect, pulse)</div>
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
					<div class="sizes-demo__grid-cell sizes-demo__grid-cell--label">{{ size }}</div>
					<div v-for="variant in variants" :key="variant" class="sizes-demo__grid-cell">
						<Skeleton
							:visible="visible"
							:rendered="rendered"
							:size="size"
							:variant="variant"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Shapes -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__title">Shapes (accent, pulse, width=64px, height=64px)</div>
			<div class="sizes-demo__shapes">
				<div v-for="shape in shapes" :key="shape" class="sizes-demo__shape-item">
					<div class="sizes-demo__shape-label">{{ shape }}</div>
					<Skeleton
						:visible="visible"
						:rendered="rendered"
						variant="accent"
						:shape="shape"
						animation="pulse"
						width="64px"
						height="64px"
					/>
				</div>
			</div>
		</div>

		<!-- Animations -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__title">
				Animations (normal, rect, width=200px, height=32px)
			</div>
			<div class="sizes-demo__shapes">
				<div v-for="anim in animations" :key="anim" class="sizes-demo__shape-item">
					<div class="sizes-demo__shape-label">{{ anim }}</div>
					<Skeleton
						:visible="visible"
						:rendered="rendered"
						variant="normal"
						shape="rect"
						:animation="anim"
						width="200px"
						height="32px"
					/>
				</div>
			</div>
		</div>

		<!-- Slot demo: skeleton wraps real components -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__title">
				Skeleton wraps real components (visible=true → skeleton shown)
			</div>
			<div class="sizes-demo__slot-grid">
				<div class="sizes-demo__slot-item">
					<div class="sizes-demo__slot-label">Button</div>
					<Skeleton
						:visible="visible"
						:rendered="rendered"
						size="lg"
						variant="accent"
						shape="rounded"
						animation="wave"
						width="120px"
						height="40px"
					>
						<Button variant="accent">Click Me</Button>
					</Skeleton>
				</div>
				<div class="sizes-demo__slot-item">
					<div class="sizes-demo__slot-label">CheckBox</div>
					<Skeleton
						:visible="visible"
						:rendered="rendered"
						variant="positive"
						shape="circle"
						animation="pulse"
					>
						<CheckBox>Accept terms</CheckBox>
					</Skeleton>
				</div>
				<div class="sizes-demo__slot-item">
					<div class="sizes-demo__slot-label">Switch</div>
					<Skeleton
						:visible="visible"
						:rendered="rendered"
						variant="caution"
						shape="rounded"
						animation="wave"
					>
						<Switch>Enable feature</Switch>
					</Skeleton>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@reference "./../../../../foundation/tailwind/index.css";

.sizes-demo {
	$this: &;

	&__section {
		@apply mb-8;
	}

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
		grid-template-columns: 120px repeat(5, 1fr);
	}

	&__grid-row {
		@apply grid;
		@apply py-2;
		@apply border-b border-gray-100;
		grid-template-columns: 120px repeat(5, 1fr);
	}

	&__grid-cell {
		@apply flex items-center justify-center;
		@apply p-2;

		&--header {
			@apply font-medium text-sm;
			@apply text-gray-600;
		}

		&--label {
			@apply font-medium text-sm;
			@apply text-gray-500;
			@apply justify-start;
		}
	}

	&__shapes {
		@apply flex gap-8;
		@apply justify-center;
		@apply flex-wrap;
	}

	&__shape-item {
		@apply flex flex-col items-center;
		@apply gap-3;
	}

	&__shape-label {
		@apply text-sm text-gray-500;
		@apply capitalize;
	}

	&__slot-grid {
		@apply flex gap-6;
		@apply justify-center;
		@apply flex-wrap;
	}

	&__slot-item {
		@apply flex flex-col items-center;
		@apply gap-3;
	}

	&__slot-label {
		@apply text-sm text-gray-500;
		@apply font-medium;
	}
}
</style>
