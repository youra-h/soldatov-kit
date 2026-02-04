<script setup lang="ts">
import { Icon, useIconImport } from '@ui/icon'
import PanelDemo from '../common/PanelDemo.vue'
import type { TComponentSize } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
	size?: TComponentSize
	width?: number | string
	height?: number | string
}

const props = defineProps<Props>()
</script>

<template>
	<PanelDemo info="Controlled by props from Properties panel">
		<Icon
			:tag="useIconImport(tag || '/src/icons/home.svg')"
			:visible="visible"
			:rendered="rendered"
			:size="size"
			:width="width"
			:height="height"
		/>
	</PanelDemo>
</template>
