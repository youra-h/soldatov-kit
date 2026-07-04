<script setup lang="ts">
import { Input } from '@ui/input'
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
					<Input
						:visible="visible"
						:rendered="rendered"
						:size="size"
						:variant="variant"
						:value="size + ' / ' + variant"
					/>
				</div>
			</div>
		</div>

		<!-- States -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__section-title">States</div>
			<div class="sizes-demo__section-grid">
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Normal</div>
					<Input :visible="visible" :rendered="rendered" value="Typing..." />
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Disabled</div>
					<Input :visible="visible" :rendered="rendered" disabled value="Disabled" />
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Readonly</div>
					<Input :visible="visible" :rendered="rendered" readonly value="Read only" />
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Placeholder</div>
					<Input
						:visible="visible"
						:rendered="rendered"
						placeholder="Enter text..."
					/>
				</div>
			</div>
		</div>
	</div>
</template>
