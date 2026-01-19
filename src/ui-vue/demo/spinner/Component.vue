<script setup lang="ts">
import { Spinner } from '@ui/spinner'
import type { TComponentSize } from '../common/SizeSelector.vue'
import type { TComponentVariant } from '../common/VariantSelector.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
}

const props = defineProps<Props>()
</script>

<template>
	<Spinner
		:visible="visible"
		:rendered="rendered"
		:size="size"
		:variant="variant"
		class="props-demo"
	/>
</template>
