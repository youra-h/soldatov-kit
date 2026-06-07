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
					<template #content>
						<p>Content for section 1 — {{ appearance }} appearance</p>
					</template>
				</CollapseItem>
				<CollapseItem text="Section 2" value="s2">
					<template #content>
						<p>Content for section 2</p>
					</template>
				</CollapseItem>
				<CollapseItem text="Section 3" value="s3">
					<template #content>
						<p>Content for section 3</p>
					</template>
				</CollapseItem>
			</Collapse>
		</div>

		<!-- Single mode -->
		<div class="collapse-slots-demo__section">
			<h4 class="collapse-slots-demo__subtitle">mode: single</h4>
			<Collapse appearance="outlined" :size="size" :variant="variant" mode="single">
				<CollapseItem text="Single mode — only one open" value="s1" :selected="true">
					<template #content><p>Only one section can be open at a time</p></template>
				</CollapseItem>
				<CollapseItem text="Section 2" value="s2">
					<template #content><p>Opening this will close Section 1</p></template>
				</CollapseItem>
				<CollapseItem text="Section 3" value="s3">
					<template #content><p>Section 3 content</p></template>
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
						<template #content><p>Arrow is on the left</p></template>
					</CollapseItem>
					<CollapseItem text="Arrow end" value="s2" arrow-placement="end">
						<template #content><p>Arrow is on the right</p></template>
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
					<template #content><p>Custom slot leading the text</p></template>
				</CollapseItem>
				<CollapseItem text="With icon trailing" value="s2">
					<template #trailing>
						<span class="collapse-slots-demo__badge">3</span>
					</template>
					<template #content><p>Custom slot trailing the text</p></template>
				</CollapseItem>
			</Collapse>
		</div>
	</div>
</template>
