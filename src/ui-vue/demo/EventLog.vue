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
	maxEntries: 100,
})

const emit = defineEmits<{
	clear: []
}>()

const displayedEvents = computed(() => props.events.slice(0, props.maxEntries))

const formatTime = (timestamp: string) => {
	const date = new Date(timestamp)
	const time = date.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})
	const ms = date.getMilliseconds().toString().padStart(3, '0')
	return `${time}.${ms}`
}
</script>

<template>
	<div class="event-log">
		<div v-if="displayedEvents.length === 0" class="event-log__empty">No events yet</div>
		<div v-else class="event-log__content">
			<div class="event-log__header">
				<span class="event-log__count">{{ displayedEvents.length }} events</span>
				<button class="event-log__clear-btn" @click="emit('clear')">
					Clear logs
				</button>
			</div>
			<div class="event-log__list">
				<div v-for="(event, idx) in displayedEvents" :key="idx" class="event-log__entry">
					<span class="event-log__timestamp">{{ formatTime(event.timestamp) }}</span>
					<span class="event-log__separator">|</span>
					<span :class="['event-log__source', `event-log__source--${event.source}`]">
						{{ event.source }}
					</span>
					<span class="event-log__separator">→</span>
					<span class="event-log__name">{{ event.name }}</span>
					<span v-if="event.payload !== undefined" class="event-log__payload">
						{{ JSON.stringify(event.payload) }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@reference "./../../foundation/tailwind/index.css";

.event-log {
	$this: &;

	@apply flex flex-col;
	@apply h-96;
	@apply overflow-auto;

	&__empty {
		@apply text-gray-500;
		@apply italic;
		@apply text-center;
		@apply py-4;
	}

	&__content {
		@apply flex flex-col;
		@apply h-full;
	}

	&__header {
		@apply flex items-center justify-between;
		@apply mb-3;
		@apply pb-2;
		@apply border-b border-gray-300;
	}

	&__count {
		@apply text-sm;
		@apply font-medium;
		@apply text-gray-700;
	}

	&__clear-btn {
		@apply px-3 py-1;
		@apply text-xs;
		@apply font-medium;
		@apply bg-red-500;
		@apply text-white;
		@apply rounded;
		@apply transition-colors;
		@apply hover:bg-red-600;
		@apply focus:outline-none;
		@apply focus:ring-2;
		@apply focus:ring-red-500;
		@apply focus:ring-offset-1;
	}

	&__list {
		@apply space-y-1;
		@apply overflow-auto;
		@apply flex-1;
	}

	&__entry {
		@apply font-mono;
		@apply text-sm;
		@apply border-b border-gray-200;
		@apply pb-1;
	}

	&__timestamp {
		@apply text-gray-500;
	}

	&__separator {
		@apply mx-2;
	}

	&__source {
		@apply font-semibold;

		&--props {
			@apply text-blue-600;
		}

		&--instance {
			@apply text-green-600;
		}

		&--core {
			@apply text-purple-600;
		}

		&--vue {
			@apply text-orange-600;
		}
	}

	&__name {
		@apply text-gray-800;
	}

	&__payload {
		@apply text-gray-600;
		@apply ml-2;
	}
}
</style>
