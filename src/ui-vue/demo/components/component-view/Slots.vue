<script setup lang="ts">
import { ComponentView } from '@ui/component-view'
import PanelDemo from '../../common/PanelDemo.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
}

defineProps<Props>()
</script>

<template>
	<div style="display: flex; flex-direction: column; gap: 1rem">
		<PanelDemo title="Default Slot">
			<ComponentView
				:tag="tag"
				:visible="visible"
				:rendered="rendered"
				style="border: 2px solid #a855f7; border-radius: 0.5rem; padding: 1rem"
			>
				<div style="text-align: center">
					<div style="font-weight: 600; color: #7c3aed">Default Slot</div>
					<div style="font-size: 0.75rem; color: #666">Simple text content</div>
				</div>
			</ComponentView>
		</PanelDemo>

		<PanelDemo title="Multiple Children">
			<ComponentView
				:tag="tag"
				:visible="visible"
				:rendered="rendered"
				style="border: 2px solid #f97316; border-radius: 0.5rem; padding: 1rem"
			>
				<div
					style="text-align: center; display: flex; flex-direction: column; gap: 0.25rem"
				>
					<div style="font-weight: 600; color: #ea580c">Multiple Children</div>
					<button
						style="
							padding: 0.25rem 0.5rem;
							background: #f97316;
							color: white;
							border-radius: 0.25rem;
							font-size: 0.75rem;
							border: none;
							cursor: pointer;
						"
					>
						Button
					</button>
					<p style="font-size: 0.75rem; color: #666; margin: 0">Some paragraph text</p>
				</div>
			</ComponentView>
		</PanelDemo>

		<PanelDemo title="Complex Content">
			<ComponentView
				:tag="tag"
				:visible="visible"
				:rendered="rendered"
				style="border: 2px solid #ec4899; border-radius: 0.5rem; padding: 1rem"
			>
				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem">
					<div
						style="
							background: #fce7f3;
							padding: 0.5rem;
							border-radius: 0.25rem;
							font-size: 0.75rem;
							text-align: center;
						"
					>
						Item 1
					</div>
					<div
						style="
							background: #fce7f3;
							padding: 0.5rem;
							border-radius: 0.25rem;
							font-size: 0.75rem;
							text-align: center;
						"
					>
						Item 2
					</div>
					<div
						style="
							background: #fce7f3;
							padding: 0.5rem;
							border-radius: 0.25rem;
							font-size: 0.75rem;
							text-align: center;
						"
					>
						Item 3
					</div>
					<div
						style="
							background: #fce7f3;
							padding: 0.5rem;
							border-radius: 0.25rem;
							font-size: 0.75rem;
							text-align: center;
						"
					>
						Item 4
					</div>
				</div>
			</ComponentView>
		</PanelDemo>
	</div>
</template>
