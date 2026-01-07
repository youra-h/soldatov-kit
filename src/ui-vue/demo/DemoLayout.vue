<script setup lang="ts">
type Props = {
	title: string
}

defineProps<Props>()
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="flex items-center justify-between">
			<h1 class="text-lg font-semibold">{{ title }}</h1>
			<slot name="header" />
		</div>

		<div class="flex flex-col gap-3">
			<slot name="controls" />
		</div>

		<div class="grid gap-4" style="grid-template-columns: 1fr 1fr;">
			<div class="p-3 border rounded">
				<slot />
			</div>

			<div class="p-3 border rounded">
				<div class="font-medium mb-2">Events</div>
				<slot name="events" />
			</div>
		</div>
	</div>
</template>
