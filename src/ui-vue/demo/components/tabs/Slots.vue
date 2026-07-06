<script setup lang="ts">
import { TTabs } from '@core'
import { Tabs, TabItem } from '@ui/tabs'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	size?: TComponentSize
	variant?: TComponentVariant
}

defineProps<Props>()

const APPEARANCES = ['line', 'contained', 'outline'] as const

const tabsInstance = new TTabs({
	items: [
		{ text: 'Users', value: 'users', active: true },
		{ text: 'Settings', value: 'settings' },
		{ text: 'Profile', value: 'profile' },
	],
})
</script>

<template>
	<div class="tabs-slots-demo">
		<!-- Views per variant -->
		<div v-for="view in APPEARANCES" :key="view" class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">{{ view }}</h4>

			<div class="tabs-slots-demo__group">
				<Tabs :view="view" :size="size" :variant="variant">
					<TabItem text="Tab 1" value="t1" active />
					<TabItem text="Tab 2" value="t2" />
					<TabItem text="Tab 3" value="t3" />
					<template #panel:t1><p>Content 1</p></template>
					<template #panel:t2><p>Content 2</p></template>
					<template #panel:t3><p>Content 3</p></template>
				</Tabs>
			</div>
		</div>

		<!-- Leading / Trailing slots -->
		<div class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">Leading & Trailing slots</h4>
			<Tabs view="line" :size="size" :variant="variant" disabled>
				<template #leading>
					<span class="tabs-slots-demo__badge">leading</span>
				</template>
				<TabItem text="Tab 1" value="t1" active />
				<TabItem text="Tab 2" value="t2" @click="console.log('click')" class="qwe"/>
				<TabItem text="Tab 3" value="t3" />
				<template #trailing>
					<span class="tabs-slots-demo__badge">trailing</span>
				</template>
				<template #panel:t1><p>Content 1</p></template>
				<template #panel:t2><p>Content 2</p></template>
				<template #panel:t3><p>Content 3</p></template>
			</Tabs>
		</div>

		<!-- Closable tabs -->
		<div class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">Closable tabs</h4>
			<Tabs view="contained" :size="size" :variant="variant" :closable="true">
				<TabItem text="Tab 1" value="t1" active />
				<TabItem text="Tab 2" value="t2" />
				<TabItem text="Tab 3 (not closable)" value="t3" :closable="false" />
				<template #panel:t1><p>Content 1</p></template>
				<template #panel:t2><p>Content 2</p></template>
				<template #panel:t3><p>Content 3</p></template>
			</Tabs>
		</div>

		<!-- #item slot — кастомизация через scoped slot -->
		<div class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">Custom #item slot</h4>
			<Tabs :instance="tabsInstance" view="line" :size="size" :variant="variant">
				<template #item="{ ctrl, text, value }">
					<TabItem :ctrl="ctrl">
						<template #leading>
							<span v-if="value === 'users'">👤</span>
							<span v-else-if="value === 'settings'">⚙️</span>
							<span v-else>📋</span>
						</template>
					</TabItem>
				</template>
				<template #panel:users><p>Users panel</p></template>
				<template #panel:settings><p>Settings panel</p></template>
				<template #panel:profile><p>Profile panel</p></template>
			</Tabs>
		</div>

		<!-- Alignment -->
		<div class="tabs-slots-demo__section">
			<h4 class="tabs-slots-demo__subtitle">Alignment</h4>
			<div class="tabs-slots-demo__group">
				<span class="tabs-slots-demo__label">center</span>
				<Tabs view="line" alignment="center" :size="size" :variant="variant">
					<TabItem text="Tab 1" value="t1" active />
					<TabItem text="Tab 2" value="t2" />
					<TabItem text="Tab 3" value="t3" />
				</Tabs>
			</div>
			<div class="tabs-slots-demo__group">
				<span class="tabs-slots-demo__label">end</span>
				<Tabs view="line" alignment="end" :size="size" :variant="variant">
					<TabItem text="Tab 1" value="t1" active />
					<TabItem text="Tab 2" value="t2" />
					<TabItem text="Tab 3" value="t3" />
				</Tabs>
			</div>
			<div class="tabs-slots-demo__group">
				<span class="tabs-slots-demo__label">stretch</span>
				<Tabs view="line" alignment="stretch" :size="size" :variant="variant">
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
					<Tabs view="contained" orientation="vertical" :size="size" :variant="variant">
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
					<Tabs
						view="contained"
						orientation="vertical"
						position="end"
						:size="size"
						:variant="variant"
					>
						<TabItem text="Tab 1" value="t1" active />
						<TabItem text="Tab 2" value="t2" />
						<TabItem text="Tab 3" value="t3" />
						<template #panel:t1><p>Content 1</p></template>
						<template #panel:t2><p>Content 2</p></template>
						<template #panel:t3><p>Content 3</p></template>
					</Tabs>
				</div>
			</div>
			<!-- Per-item slots via Tabs: item:value:leading / item:value / item:value:trailing -->
			<div class="tabs-slots-demo__section">
				<h4 class="tabs-slots-demo__subtitle">Per-item slots via Tabs</h4>
				<Tabs :ctrl="tabsInstance" view="line" :size="size" :variant="variant">
					<template #item:users:leading>
						<span>👤</span>
					</template>
					<template #item:settings="{ item }">
						<span :class="{ 'font-bold': item.active }">{{ item.text }}</span>
					</template>
					<template #item:profile:trailing>
						<span class="tabs-slots-demo__badge">new</span>
					</template>
					<template #panel:users><p>Users panel</p></template>
					<template #panel:settings><p>Settings panel</p></template>
					<template #panel:profile><p>Profile panel</p></template>
				</Tabs>
			</div>

			<!-- #item catch-all -->
			<div class="tabs-slots-demo__section">
				<h4 class="tabs-slots-demo__subtitle">Custom #item slot (catch-all)</h4>
				<Tabs :ctrl="tabsInstance" view="line" :size="size" :variant="variant">
					<template #item="{ item }">
						<div class="flex items-center gap-2">
							<span>{{ item.active ? '🔵' : '⚪' }}</span>
							<span :class="{ 'font-bold': item.active }">{{ item.text }}</span>
						</div>
					</template>
					<template #panel:users><p>Users panel</p></template>
					<template #panel:settings><p>Settings panel</p></template>
					<template #panel:profile><p>Profile panel</p></template>
				</Tabs>
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
