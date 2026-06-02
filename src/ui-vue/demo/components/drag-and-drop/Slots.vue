<script setup lang="ts">
import { DragAndDrop } from '@ui/drag-and-drop'
import { Tabs, TabItem } from '@ui/tabs'
import type { TComponentSize, TComponentVariant, TTabsOrientation } from '@core'

type Props = {
	orientation: TTabsOrientation
	size?: TComponentSize
	variant?: TComponentVariant
}

defineProps<Props>()
</script>

<template>
	<div class="drag-slots-demo">
		<p class="drag-slots-demo__hint">
			Зажмите вкладку и перетащите её в новое место. Проверьте поведение в горизонтальной и вертикальной ориентации.
		</p>

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
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../../foundation/tailwind/index.css";

.drag-slots-demo {
	@apply w-full;
	@apply flex flex-col gap-4;

	&__hint {
		@apply text-xs text-gray-500;
	}
}
</style>
