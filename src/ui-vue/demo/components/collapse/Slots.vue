<script setup lang="ts">
import { TCollapse } from '@core'
import { Collapse, CollapseItem } from '@ui/collapse'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	size?: TComponentSize
	variant?: TComponentVariant
}

defineProps<Props>()

const APPEARANCES = ['plain', 'outlined', 'filled'] as const

const collapseInstance = new TCollapse({
	items: [
		{ text: 'Section A', value: 'sA', selected: true },
		{ text: 'Section B', value: 'sB' },
		{ text: 'Section C', value: 'sC' },
	],
	mode: 'multiple',
})
</script>

<template>
	<div class="collapse-slots-demo">
		<!-- Views -->
		<div v-for="view in APPEARANCES" :key="view" class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">{{ view }}</h4>

			<Collapse :view="view" :size="size" :variant="variant" mode="multiple">
				<CollapseItem text="Section 1" value="s1" :selected="true">
					<p>Content for section 1 — {{ view }} view</p>
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
			<Collapse view="outlined" :size="size" :variant="variant" mode="single">
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
				<Collapse view="plain" :size="size" :variant="variant" mode="multiple">
					<CollapseItem text="Arrow start" value="s1" arrow-placement="start">
						<p>Arrow is on the left</p>
					</CollapseItem>
					<CollapseItem text="Arrow end" value="s2" arrow-placement="end">
						<p>Arrow is on the right</p>
					</CollapseItem>
				</Collapse>
			</div>
		</div>

		<!-- #item slot — кастомизация через scoped slot -->
		<div class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">Custom #item slot</h4>
			<Collapse
				:instance="collapseInstance"
				view="outlined"
				:size="size"
				:variant="variant"
				mode="multiple"
			>
				<template #item="{ ctrl, text, selected }">
					{{ text }} — {{ selected ? 'selected' : 'not selected' }}
					<!-- <CollapseItem :ctrl="ctrl">
						<template #leading>
							<span class="collapse-slots-demo__badge">{{
								selected ? '📂' : '📁'
							}}</span>
						</template>
						<p>
							Content for <strong>{{ text }}</strong>
						</p>
					</CollapseItem> -->
				</template>
			</Collapse>
		</div>

		<!-- Custom leading/trailing slots -->
		<div class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">Custom leading/trailing slots</h4>
			<Collapse view="outlined" :size="size" :variant="variant" mode="multiple">
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

		<!-- Per-item slots via Collapse: item:value:leading / item:value:header / item:value:trailing -->
		<div class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">Per-item slots via Collapse</h4>
			<Collapse
				:ctrl="collapseInstance"
				view="outlined"
				:size="size"
				:variant="variant"
			>
				<template #item:sA:leading>
					<span class="collapse-slots-demo__badge">📂</span>
				</template>
				<template #item:sB:header="{ item }">
					<span :class="{ 'font-bold': item.selected }">{{ item.text }}</span>
				</template>
				<template #item:sC:trailing>
					<span class="collapse-slots-demo__badge">🔒</span>
				</template>
				<template #panel:sA><p>Content A</p></template>
				<template #panel:sB><p>Content B</p></template>
				<template #panel:sC><p>Content C</p></template>
			</Collapse>
		</div>

		<!-- #item catch-all -->
		<div class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">Custom #item slot (catch-all)</h4>
			<Collapse
				:ctrl="collapseInstance"
				view="outlined"
				:size="size"
				:variant="variant"
			>
				<template #item="{ item }">
					<div class="flex items-center gap-2">
						<span>{{ item.selected ? '📂' : '📁' }}</span>
						<span :class="{ 'font-bold': item.selected }">{{ item.text }}</span>
					</div>
				</template>
				<template #panel:sA><p>Content A</p></template>
				<template #panel:sB><p>Content B</p></template>
				<template #panel:sC><p>Content C</p></template>
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
