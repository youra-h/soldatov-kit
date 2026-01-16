<script setup lang="ts">
import { ComponentView } from '@ui/component-view'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
}

defineProps<Props>()
</script>

<template>
	<div class="space-y-4">
		<!-- Default slot -->
		<ComponentView
			:tag="tag"
			:visible="visible"
			:rendered="rendered"
			class="border-2 border-purple-500 rounded p-3"
		>
			<div class="text-center">
				<div class="font-semibold text-purple-700">Default Slot</div>
				<div class="text-xs text-gray-600">Simple text content</div>
			</div>
		</ComponentView>

		<!-- With multiple children -->
		<ComponentView
			:tag="tag"
			:visible="visible"
			:rendered="rendered"
			class="border-2 border-orange-500 rounded p-3"
		>
			<div class="text-center space-y-1">
				<div class="font-semibold text-orange-700">Multiple Children</div>
				<button class="px-2 py-1 bg-orange-500 text-white rounded text-xs">Button</button>
				<p class="text-xs text-gray-600">Some paragraph text</p>
			</div>
		</ComponentView>

		<!-- With complex content -->
		<ComponentView
			:tag="tag"
			:visible="visible"
			:rendered="rendered"
			class="border-2 border-pink-500 rounded p-3"
		>
			<div class="grid grid-cols-2 gap-2">
				<div class="bg-pink-100 p-2 rounded text-xs text-center">Item 1</div>
				<div class="bg-pink-100 p-2 rounded text-xs text-center">Item 2</div>
				<div class="bg-pink-100 p-2 rounded text-xs text-center">Item 3</div>
				<div class="bg-pink-100 p-2 rounded text-xs text-center">Item 4</div>
			</div>
		</ComponentView>
	</div>
</template>
