<script setup lang="ts">
import { Tabs, TabItem } from '@ui/tabs'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	size?: TComponentSize
	variant?: TComponentVariant
}

defineProps<Props>()

const APPEARANCES = ['line', 'contained', 'outline'] as const
</script>

<template>
	<div class="tabs-slots-demo">
		<!-- Appearances per variant -->
		<div v-for="appearance in APPEARANCES" :key="appearance" class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">{{ appearance }}</h4>

			<div class="tabs-slots-demo__group">
				<Tabs :appearance="appearance" :size="size" :variant="variant">
					<TabItem text="Tab 1" value="t1" active />
					<TabItem text="Tab 2" value="t2" />
					<TabItem text="Tab 3" value="t3" />
					<template #panel:t1><p>Content 1</p></template>
					<template #panel:t2><p>Content 2</p></template>
					<template #panel:t3><p>Content 3</p></template>
				</Tabs>
			</div>
		</div>

		<!-- Prefix / Suffix slots -->
		<div class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">Prefix & Suffix slots</h4>
			<Tabs appearance="line" :size="size" :variant="variant">
				<template #prefix>
					<span class="tabs-slots-demo__badge">prefix</span>
				</template>
				<TabItem text="Tab 1" value="t1" active />
				<TabItem text="Tab 2" value="t2" />
				<TabItem text="Tab 3" value="t3" />
				<template #suffix>
					<span class="tabs-slots-demo__badge">suffix</span>
				</template>
				<template #panel:t1><p>Content 1</p></template>
				<template #panel:t2><p>Content 2</p></template>
				<template #panel:t3><p>Content 3</p></template>
			</Tabs>
		</div>

		<!-- Closable tabs -->
		<div class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">Closable tabs</h4>
			<Tabs appearance="contained" :size="size" :variant="variant" :closable="true">
				<TabItem text="Tab 1" value="t1" active />
				<TabItem text="Tab 2" value="t2" />
				<TabItem text="Tab 3 (not closable)" value="t3" :closable="false" />
				<template #panel:t1><p>Content 1</p></template>
				<template #panel:t2><p>Content 2</p></template>
				<template #panel:t3><p>Content 3</p></template>
			</Tabs>
		</div>

		<!-- Alignment -->
		<div class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">Alignment</h4>
			<div class="tabs-slots-demo__group">
				<span class="tabs-slots-demo__label">center</span>
				<Tabs appearance="line" alignment="center" :size="size" :variant="variant">
					<TabItem text="Tab 1" value="t1" active />
					<TabItem text="Tab 2" value="t2" />
					<TabItem text="Tab 3" value="t3" />
				</Tabs>
			</div>
			<div class="tabs-slots-demo__group">
				<span class="tabs-slots-demo__label">end</span>
				<Tabs appearance="line" alignment="end" :size="size" :variant="variant">
					<TabItem text="Tab 1" value="t1" active />
					<TabItem text="Tab 2" value="t2" />
					<TabItem text="Tab 3" value="t3" />
				</Tabs>
			</div>
			<div class="tabs-slots-demo__group">
				<span class="tabs-slots-demo__label">stretch</span>
				<Tabs appearance="line" alignment="stretch" :size="size" :variant="variant">
					<TabItem text="Tab 1" value="t1" active />
					<TabItem text="Tab 2" value="t2" />
					<TabItem text="Tab 3" value="t3" />
				</Tabs>
			</div>
		</div>

		<!-- Vertical -->
		<div class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">Vertical (position: start / end)</h4>
			<div class="tabs-slots-demo__row">
				<div class="tabs-slots-demo__col">
					<span class="tabs-slots-demo__label">position: start</span>
					<Tabs appearance="contained" orientation="vertical" :size="size" :variant="variant">
						<TabItem text="Tab 1" value="t1" active />
						<TabItem text="Tab 2" value="t2" />
						<TabItem text="Tab 3" value="t3" />
						<template #panel:t1><p>Content 1</p></template>
						<template #panel:t2><p>Content 2</p></template>
						<template #panel:t3><p>Content 3</p></template>
					</Tabs>
				</div>
				<div class="tabs-slots-demo__col">
					<span class="tabs-slots-demo__label">position: end</span>
					<Tabs appearance="contained" orientation="vertical" position="end" :size="size" :variant="variant">
						<TabItem text="Tab 1" value="t1" active />
						<TabItem text="Tab 2" value="t2" />
						<TabItem text="Tab 3" value="t3" />
						<template #panel:t1><p>Content 1</p></template>
						<template #panel:t2><p>Content 2</p></template>
						<template #panel:t3><p>Content 3</p></template>
					</Tabs>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../../foundation/tailwind/index.css";

.tabs-slots-demo {
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

	&__row {
		@apply grid grid-cols-2 gap-6;
	}

	&__col {
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
