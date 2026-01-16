<script setup lang="ts">
import { computed } from 'vue'

export type EventLogEntry = {
	timestamp: string
	source: 'props' | 'instance' | 'core' | 'vue'
	name: string
	payload?: unknown
}

type Props = {
	events: EventLogEntry[]
	maxEntries?: number
}

const props = withDefaults(defineProps<Props>(), {
	maxEntries: 100
})

const displayedEvents = computed(() => props.events.slice(0, props.maxEntries))

const formatTime = (timestamp: string) => {
	const date = new Date(timestamp)
	const time = date.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
	const ms = date.getMilliseconds().toString().padStart(3, '0')
	return `${time}.${ms}`
}

const getSourceColor = (source: EventLogEntry['source']) => {
	const colors = {
		props: 'text-blue-600',
		instance: 'text-green-600',
		core: 'text-purple-600',
		vue: 'text-orange-600'
	}
	return colors[source]
}
</script>

<template>
	<div class="flex flex-col h-96 overflow-auto">
		<div v-if="displayedEvents.length === 0" class="text-gray-500 italic text-center py-4">
			No events yet
		</div>
		<div v-else class="space-y-1">
			<div
				v-for="(event, idx) in displayedEvents"
				:key="idx"
				class="font-mono text-sm border-b border-gray-200 pb-1"
			>
				<span class="text-gray-500">{{ formatTime(event.timestamp) }}</span>
				<span class="mx-2">|</span>
				<span :class="getSourceColor(event.source)" class="font-semibold">{{ event.source }}</span>
				<span class="mx-2">→</span>
				<span class="text-gray-800">{{ event.name }}</span>
				<span v-if="event.payload !== undefined" class="text-gray-600 ml-2">
					{{ JSON.stringify(event.payload) }}
				</span>
			</div>
		</div>
	</div>
</template>
