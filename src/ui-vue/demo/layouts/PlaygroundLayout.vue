<script setup lang="ts">
type Props = {
	title: string
}

defineProps<Props>()
</script>

<template>
	<div class="pg-layout">
		<!-- Header -->
		<div class="pg-layout__header">
			<h1 class="pg-layout__title">{{ title }}</h1>
		</div>

		<!-- Row 1: Properties Panel -->
		<div class="pg-layout__section pg-layout__section--properties">
			<h2 class="pg-layout__section-title">Properties</h2>
			<slot name="properties" />
		</div>

		<!-- Row 2: Three Column Demo -->
		<div class="pg-layout__demo-grid">
			<!-- Column 1: Props Demo -->
			<div class="pg-layout__demo-column">
				<h3 class="pg-layout__demo-title">Props Demo</h3>
				<div class="pg-layout__demo-content">
					<slot name="props-demo" />
				</div>
			</div>

			<!-- Column 2: Instance Demo -->
			<div class="pg-layout__demo-column">
				<h3 class="pg-layout__demo-title">Instance Demo</h3>
				<div class="pg-layout__demo-content">
					<slot name="instance-demo" />
				</div>
			</div>

			<!-- Column 3: Slots Demo -->
			<div class="pg-layout__demo-column">
				<h3 class="pg-layout__demo-title">Slots Demo</h3>
				<div class="pg-layout__demo-content">
					<slot name="slots-demo" />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind/index.css";

.pg-layout {
	$this: &;
	@apply flex flex-col;
	@apply gap-6;
	@apply p-4;

	&__header {
		@apply flex items-center justify-between;
	}

	&__title {
		@apply text-2xl;
		@apply font-bold;
	}

	&__section {
		@apply border rounded-lg;
		@apply p-4;

		&--properties {
			@apply bg-gray-50;
		}
	}

	&__section-title {
		@apply text-lg;
		@apply font-semibold;
		@apply mb-3;
	}

	&__demo-grid {
		@apply grid;
		@apply gap-4;
		grid-template-columns: 1fr 1fr 2fr;
	}

	&__demo-column {
		@apply border rounded-lg;
		@apply p-4;
		@apply flex flex-col;
		@apply max-h-[800px];

		&:nth-child(3) {
			@apply overflow-y-auto;
		}
	}

	&__demo-title {
		@apply text-sm;
		@apply font-semibold;
		@apply mb-3;
	}

	&__demo-content {
		@apply flex-1;
		@apply flex items-center justify-center;
	}
}
</style>
