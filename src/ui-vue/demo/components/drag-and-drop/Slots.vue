<script setup lang="ts">
import { ref } from 'vue'
import { TTabs } from '@core'
import { DragAndDrop } from '@ui/drag-and-drop'
import { Tabs, TabItem } from '@ui/tabs'
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
tabs.appearance = 'contained'
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
</script>

<template>
	<div class="drag-slots-demo">
		<p class="drag-slots-demo__hint">
			Зажмите вкладку и перетащите её в новое место. Проверьте поведение в горизонтальной и вертикальной ориентации.
		</p>

		<!-- Вариант 1: декларативный (TabItem в слоте) -->
		<section class="drag-slots-demo__section">
			<h3 class="drag-slots-demo__title">Declarative (TabItem slots)</h3>
			<DragAndDrop>
				<Tabs :orientation="orientation" :size="size" :variant="variant" appearance="line">
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
				<Tabs :items="tabItems" appearance="outline">
					<template #panel:profile><p>Profile content</p></template>
					<template #panel:notifications><p>Notifications content</p></template>
					<template #panel:security><p>Security content</p></template>
					<template #panel:billing><p>Billing content</p></template>
					<template #panel:api-keys><p>API Keys content</p></template>
				</Tabs>
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
		@apply flex flex-col gap-10;
	}

	&__title {
		@apply text-sm font-medium text-gray-600;
	}
}
</style>
