<script setup lang="ts">
import { Input } from '@ui/input'
import { Button } from '@ui/button'
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

const searchIcon = useIconImport('/src/icons/check.svg')
const closeIcon = useIconImport('/src/icons/close.svg')
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

		<!-- Leading / Trailing slots -->
		<div class="sizes-demo__section">
			<div class="sizes-demo__section-title">Leading / Trailing slots</div>
			<div class="flex gap-4 flex-wrap">
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Leading icon</div>
					<Input
						:visible="visible"
						:rendered="rendered"
						value="Search"
					>
						<template #leading>
							<Icon :tag="searchIcon" />
						</template>
					</Input>
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Trailing icon</div>
					<Input
						:visible="visible"
						:rendered="rendered"
						value="Clear"
					>
						<template #trailing>
							<Icon :tag="closeIcon" />
						</template>
					</Input>
				</div>
				<div class="sizes-demo__section-item">
					<div class="sizes-demo__section-label">Both icons</div>
					<Input
						:visible="visible"
						:rendered="rendered"
						placeholder="Both sides..."
					>
						<template #leading>
							<Icon :tag="searchIcon" />
							<Icon :tag="searchIcon" />
							<Button>Text</Button>
						</template>
						<template #trailing>
							<Icon :tag="closeIcon" />
							<Icon :tag="closeIcon" />
							<Button>Text</Button>
						</template>
					</Input>
				</div>
			</div>
		</div>
	</div>
</template>
