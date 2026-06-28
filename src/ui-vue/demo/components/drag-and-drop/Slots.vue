<script setup lang="ts">
import { ref } from 'vue'
import { TTabs, TCollapse } from '@core'
import { DragAndDrop } from '@ui/drag-and-drop'
import { Tabs, TabItem } from '@ui/tabs'
import { Collapse, CollapseItem } from '@ui/collapse'
import type { TComponentSize, TComponentVariant, TTabsOrientation } from '@core'

type Props = {
	orientation: TTabsOrientation
	size?: TComponentSize
	variant?: TComponentVariant
}

defineProps<Props>()

// --- Вариант 1: через instance (программный) ---

const tabs = new TTabs()
tabs.variant = 'accent'
tabs.view = 'contained'
tabs.orientation = 'horizontal'

tabs.collection.add({ text: 'Dashboard', value: 'dashboard', closable: true })
tabs.collection.add({ text: 'Reports', value: 'reports', closable: true })
tabs.collection.add({ text: 'Users', value: 'users' })
tabs.collection.add({ text: 'Logs', value: 'logs' })
tabs.collection.add({ text: 'Storage', value: 'storage' })
tabs.collection.add({ text: 'Config', value: 'config' })

const dashboardItem = tabs.collection.findBy('value', 'dashboard')!
tabs.collection.setActive(dashboardItem)

// --- Вариант 2: через prop items ---

const tabItems = ref([
	{ text: 'Profile', value: 'profile', closable: true },
	{ text: 'Notifications', value: 'notifications', active: true, closable: true },
	{ text: 'Security', value: 'security', closable: true },
	{ text: 'Billing', value: 'billing' },
	{ text: 'API Keys', value: 'api-keys', disabled: true },
])

// --- Collapse: через instance ---

const collapse = new TCollapse()
collapse.variant = 'accent'
collapse.view = 'outlined'
collapse.mode = 'multiple'

collapse.collection.add({ text: 'Getting Started', value: 'getting-started' })
collapse.collection.add({ text: 'Installation', value: 'installation' })
collapse.collection.add({ text: 'Configuration', value: 'configuration' })
collapse.collection.add({ text: 'Deployment', value: 'deployment' })
collapse.collection.add({ text: 'Troubleshooting', value: 'troubleshooting' })

const gettingStarted = collapse.collection.findBy('value', 'getting-started')!
gettingStarted.selected = true

// --- Collapse: через prop items ---

const collapseItems = ref([
	{ text: 'Overview', value: 'overview', selected: true },
	{ text: 'Quick Start', value: 'quick-start' },
	{ text: 'API Reference', value: 'api-reference' },
	{ text: 'Examples', value: 'examples' },
	{ text: 'FAQ', value: 'faq' },
])
</script>

<template>
	<div class="drag-slots-demo">
		<p class="drag-slots-demo__hint">
			Зажмите вкладку и перетащите её в новое место. Проверьте поведение в горизонтальной и
			вертикальной ориентации.
		</p>

		<!-- Вариант 1: декларативный (TabItem в слоте) -->
		<section class="drag-slots-demo__section">
			<h3 class="drag-slots-demo__title">Declarative (TabItem slots)</h3>
			<DragAndDrop>
				<Tabs :orientation="orientation" :size="size" :variant="variant" view="line">
					<TabItem text="Overview" value="overview" active />
					<TabItem text="Details" value="details" />
					<TabItem text="Analytics" value="analytics" />
					<TabItem text="History" value="history" />
					<TabItem text="Files" value="files" />
					<TabItem text="Settings" value="settings" />

					<template #panel:overview><p>Overview content</p></template>
					<template #panel:details><p>Details content</p></template>
					<template #panel:analytics><p>Analytics content</p></template>
					<template #panel:history><p>History content</p></template>
					<template #panel:files><p>Files content</p></template>
					<template #panel:settings><p>Settings content</p></template>
				</Tabs>
			</DragAndDrop>
		</section>

		<!-- Вариант 2: программный (через :ctrl) -->
		<section class="drag-slots-demo__section">
			<h3 class="drag-slots-demo__title">Instance (:ctrl)</h3>
			<DragAndDrop>
				<Tabs :ctrl="tabs">
					<template #panel:dashboard><p>Dashboard content</p></template>
					<template #panel:reports><p>Reports content</p></template>
					<template #panel:users><p>Users content</p></template>
					<template #panel:logs><p>Logs content</p></template>
					<template #panel:storage><p>Storage content</p></template>
					<template #panel:config><p>Config content</p></template>
				</Tabs>
			</DragAndDrop>
		</section>

		<!-- Вариант 3: через prop :items -->
		<section class="drag-slots-demo__section">
			<h3 class="drag-slots-demo__title">Items prop (:items)</h3>
			<DragAndDrop>
				<Tabs :items="tabItems" view="outline">
					<template #panel:profile><p>Profile content</p></template>
					<template #panel:notifications><p>Notifications content</p></template>
					<template #panel:security><p>Security content</p></template>
					<template #panel:billing><p>Billing content</p></template>
					<template #panel:api-keys><p>API Keys content</p></template>
				</Tabs>
			</DragAndDrop>
		</section>

		<!-- === Collapse === -->

		<!-- Collapse: декларативный (CollapseItem в слоте) -->
		<section class="drag-slots-demo__section">
			<h3 class="drag-slots-demo__title">Collapse — Declarative (CollapseItem slots)</h3>
			<DragAndDrop>
				<Collapse mode="multiple" view="plain">
					<CollapseItem text="Introduction" value="intro" :selected="true">
						<p>Introduction content</p>
					</CollapseItem>
					<CollapseItem text="Setup" value="setup">
						<p>Setup content</p>
					</CollapseItem>
					<CollapseItem text="Usage" value="usage">
						<p>Usage content</p>
					</CollapseItem>
					<CollapseItem text="Advanced" value="advanced">
						<p>Advanced content</p>
					</CollapseItem>
					<CollapseItem text="Migration" value="migration">
						<p>Migration content</p>
					</CollapseItem>
				</Collapse>
			</DragAndDrop>
		</section>

		<!-- Collapse: программный (через :ctrl) -->
		<section class="drag-slots-demo__section">
			<h3 class="drag-slots-demo__title">Collapse — Instance (:ctrl)</h3>
			<DragAndDrop>
				<Collapse :ctrl="collapse">
					<template #panel:getting-started><p>Getting Started content</p></template>
					<template #panel:installation><p>Installation content</p></template>
					<template #panel:configuration><p>Configuration content</p></template>
					<template #panel:deployment><p>Deployment content</p></template>
					<template #panel:troubleshooting><p>Troubleshooting content</p></template>
				</Collapse>
			</DragAndDrop>
		</section>

		<!-- Collapse: через prop :items -->
		<section class="drag-slots-demo__section">
			<h3 class="drag-slots-demo__title">Collapse — Items prop (:items)</h3>
			<DragAndDrop>
				<Collapse :items="collapseItems" mode="multiple" view="outlined">
					<template #panel:overview><p>Overview content</p></template>
					<template #panel:quick-start><p>Quick Start content</p></template>
					<template #panel:api-reference><p>API Reference content</p></template>
					<template #panel:examples><p>Examples content</p></template>
					<template #panel:faq><p>FAQ content</p></template>
				</Collapse>
			</DragAndDrop>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../../foundation/tailwind/index.css";

.drag-slots-demo {
	@apply w-full;
	@apply flex flex-col gap-6;

	&__hint {
		@apply text-xs text-gray-500;
	}

	&__section {
		@apply flex flex-col gap-4;
	}

	&__title {
		@apply text-sm font-medium text-gray-600;
	}
}
</style>
