<script setup lang="ts">
import { Collapse, CollapseItem } from '@ui/collapse'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	size?: TComponentSize
	variant?: TComponentVariant
}

defineProps<Props>()

const APPEARANCES = ['plain', 'outlined', 'filled'] as const
</script>

<template>
	<div class="collapse-slots-demo">
		<!-- Appearances -->
		<div v-for="appearance in APPEARANCES" :key="appearance" class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">{{ appearance }}</h4>

			<Collapse :appearance="appearance" :size="size" :variant="variant" mode="multiple">
				<CollapseItem text="Section 1" value="s1" :selected="true">
					<p>Content for section 1 — {{ appearance }} appearance</p>
				</CollapseItem>
				<CollapseItem text="Section 2" value="s2">
					<p>Content for section 2</p>
				</CollapseItem>
				<CollapseItem text="Section 3" value="s3">
					<p>Content for section 3</p>
				</CollapseItem>
			</Collapse>
		</div>

		<!-- Single mode -->
		<div class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">mode: single</h4>
			<Collapse appearance="outlined" :size="size" :variant="variant" mode="single">
				<CollapseItem text="Single mode — only one open" value="s1" :selected="true">
					<p>Only one section can be open at a time</p>
				</CollapseItem>
				<CollapseItem text="Section 2" value="s2">
					<p>Opening this will close Section 1</p>
				</CollapseItem>
				<CollapseItem text="Section 3" value="s3">
					<p>Section 3 content</p>
				</CollapseItem>
			</Collapse>
		</div>

		<!-- Arrow placement -->
		<div class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">Arrow placement</h4>
			<div class="collapse-slots-demo__group">
				<span class="collapse-slots-demo__label">start (default: end)</span>
				<Collapse appearance="plain" :size="size" :variant="variant" mode="multiple">
					<CollapseItem text="Arrow start" value="s1" arrow-placement="start">
						<p>Arrow is on the left</p>
					</CollapseItem>
					<CollapseItem text="Arrow end" value="s2" arrow-placement="end">
						<p>Arrow is on the right</p>
					</CollapseItem>
				</Collapse>
			</div>
		</div>

		<!-- Custom leading/trailing slots -->
		<div class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">Custom leading/trailing slots</h4>
			<Collapse appearance="outlined" :size="size" :variant="variant" mode="multiple">
				<CollapseItem text="With icon leading" value="s1">
					<template #leading>
						<span class="collapse-slots-demo__badge">⭐</span>
					</template>
					<p>Custom slot leading the text</p>
				</CollapseItem>
				<CollapseItem text="With icon trailing" value="s2">
					<template #trailing>
						<span class="collapse-slots-demo__badge">3</span>
					</template>
					<p>Custom slot trailing the text</p>
				</CollapseItem>
			</Collapse>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../../foundation/tailwind/index.css";

.collapse-slots-demo {
	@apply flex flex-col gap-8;

	&__section {
		@apply flex flex-col gap-3;
	}

	&__subtitle {
		@apply text-sm font-semibold text-gray-600 uppercase tracking-wide;
	}

	&__group {
		@apply flex flex-col gap-2;
	}

	&__label {
		@apply text-xs text-gray-400;
	}

	&__badge {
		@apply px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs;
	}
}
</style>
