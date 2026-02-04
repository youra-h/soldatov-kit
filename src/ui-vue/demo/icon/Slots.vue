<script setup lang="ts">
import { Icon, useIconImport } from '@ui/icon'
import PanelDemo from '../common/PanelDemo.vue'
import type { TComponentSize } from '../common/SizeSelector.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
}

const props = defineProps<Props>()

const sizes: TComponentSize[] = ['sm', 'normal', 'auto', 'lg', 'xl', '2xl']
</script>

<template>
	<PanelDemo title="All Sizes Demo">
		<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center">
			<div
				v-for="size in sizes"
				:key="size"
				style="
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 0.5rem;
					padding: 0.5rem;
					border: 1px solid #ddd;
					border-radius: 0.25rem;
				"
			>
				<div style="font-size: 0.75rem; color: #666; font-family: monospace">
					{{ size }}
				</div>
				<Icon
					:tag="useIconImport(tag || '/src/icons/home.svg')"
					:visible="visible"
					:rendered="rendered"
					:size="size"
				/>
			</div>
		</div>
	</PanelDemo>
</template>
