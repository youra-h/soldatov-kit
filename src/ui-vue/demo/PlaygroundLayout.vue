<script setup lang="ts">
type Props = {
	title: string
}

defineProps<Props>()
</script>

<template>
	<div class="flex flex-col gap-6 p-4">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">{{ title }}</h1>
		</div>

		<!-- Row 1: Properties Panel -->
		<div class="border rounded-lg p-4 bg-gray-50">
			<h2 class="text-lg font-semibold mb-3">Properties</h2>
			<slot name="properties" />
		</div>

		<!-- Row 2: Three Column Demo -->
		<div class="grid grid-cols-3 gap-4">
			<!-- Column 1: Props Demo -->
			<div class="border rounded-lg p-4 flex flex-col">
				<h3 class="text-sm font-semibold mb-3">Props Demo</h3>
				<div class="flex-1 flex items-center justify-center">
					<slot name="props-demo" />
				</div>
			</div>

			<!-- Column 2: Instance Demo -->
			<div class="border rounded-lg p-4 flex flex-col">
				<h3 class="text-sm font-semibold mb-3">Instance Demo</h3>
				<div class="flex-1 flex items-center justify-center">
					<slot name="instance-demo" />
				</div>
			</div>

			<!-- Column 3: Slots Demo -->
			<div class="border rounded-lg p-4 flex flex-col">
				<h3 class="text-sm font-semibold mb-3">Slots Demo</h3>
				<div class="flex-1 flex items-center justify-center">
					<slot name="slots-demo" />
				</div>
			</div>
		</div>

		<!-- Row 3: Event Log -->
		<div class="border rounded-lg p-4 bg-gray-50">
			<h2 class="text-lg font-semibold mb-3">Event Log</h2>
			<slot name="event-log" />
		</div>
	</div>
</template>
