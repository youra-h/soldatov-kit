<script setup lang="ts">
import { Button } from '@ui/button'
import { Icon } from '@ui/icon'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	size?: TComponentSize
	variant?: TComponentVariant
}

const props = defineProps<Props>()
</script>

<template>
	<div class="demo-container">
		<h3 class="demo-title">Appearances & Slots</h3>

		<div class="demo-grid">
			<!-- Normal appearance -->
			<div class="demo-section">
				<h4 class="demo-section-title">Normal</h4>
				<div class="demo-section-content">
					<Button :size="size" :variant="variant" appearance="normal" text="Default" />
					<Button :size="size" :variant="variant" appearance="normal" text="With Icon">
						<template #before>
							<Icon name="home" :size="size" />
						</template>
					</Button>
					<Button :size="size" :variant="variant" appearance="normal">
						<template #before>
							<Icon name="heart" :size="size" />
						</template>
						Icon Both
						<template #after>
							<Icon name="arrow-right" :size="size" />
						</template>
					</Button>
				</div>
			</div>

			<!-- Plain appearance -->
			<div class="demo-section">
				<h4 class="demo-section-title">Plain</h4>
				<div class="demo-section-content">
					<Button :size="size" :variant="variant" appearance="plain" text="Default" />
					<Button :size="size" :variant="variant" appearance="plain" text="With Icon">
						<template #before>
							<Icon name="settings" :size="size" />
						</template>
					</Button>
					<Button :size="size" :variant="variant" appearance="plain">
						<template #before>
							<Icon name="star" :size="size" />
						</template>
						Icon Both
						<template #after>
							<Icon name="arrow-right" :size="size" />
						</template>
					</Button>
				</div>
			</div>

			<!-- Outlined appearance -->
			<div class="demo-section">
				<h4 class="demo-section-title">Outlined</h4>
				<div class="demo-section-content">
					<Button :size="size" :variant="variant" appearance="outlined" text="Default" />
					<Button :size="size" :variant="variant" appearance="outlined" text="With Icon">
						<template #before>
							<Icon name="user" :size="size" />
						</template>
					</Button>
					<Button :size="size" :variant="variant" appearance="outlined">
						<template #before>
							<Icon name="mail" :size="size" />
						</template>
						Icon Both
						<template #after>
							<Icon name="arrow-right" :size="size" />
						</template>
					</Button>
				</div>
			</div>
		</div>

		<div class="demo-info">Demonstrating different appearances with slot combinations</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../../foundation/tailwind/index.css";
.demo-container {
	@apply p-6 bg-white rounded-lg shadow-sm;
}

.demo-title {
	@apply text-base font-semibold mb-4;
}

.demo-grid {
	@apply grid gap-4;
}

.demo-section {
	@apply border border-gray-200 rounded p-4;

	&-title {
		@apply text-sm font-medium text-gray-700 mb-3;
	}

	&-content {
		@apply flex flex-wrap gap-3;
	}
}

.demo-info {
	@apply mt-4 text-sm text-gray-500 text-center;
}
</style>
