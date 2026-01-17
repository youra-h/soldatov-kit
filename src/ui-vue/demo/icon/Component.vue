<script setup lang="ts">
import { Icon, useIconImport } from '@ui/icon'
import type { TComponentSize } from '../common/SizeSelector.vue'

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
	<Icon
		:tag="useIconImport(tag || '/src/icons/home.svg')"
		:visible="visible"
		:rendered="rendered"
		:size="size"
		:width="width"
		:height="height"
		class="props-demo"
	/>
</template>
