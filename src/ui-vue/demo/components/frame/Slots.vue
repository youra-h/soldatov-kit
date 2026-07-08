<script setup lang="ts">
import { watch } from 'vue'
import { Frame } from '@ui/frame'
import { Button } from '@ui/button'
import { TFrame } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'

type Props = {
	customX?: number
	customY?: number
	width?: number | string
	height?: number | string
	position?: 'fixed' | 'absolute'
}

const props = withDefaults(defineProps<Props>(), {
	customX: 50,
	customY: 50,
	width: 280,
	height: 180,
	position: 'fixed',
})

const positions = [
	{ label: 'Top-Left', x: 0, y: 0 },
	{ label: 'Top-Right', x: window.innerWidth - 320, y: 0 },
	{ label: 'Bottom-Left', x: 0, y: window.innerHeight - 220 },
	{ label: 'Bottom-Right', x: window.innerWidth - 320, y: window.innerHeight - 220 },
	{ label: 'Center', x: window.innerWidth / 2 - 140, y: window.innerHeight / 2 - 90 },
	{ label: 'Custom', x: props.customX, y: props.customY },
]

const frames = positions.map((pos) => ({
	...pos,
	instance: new TFrame({
		x: pos.x,
		y: pos.y,
		width: props.width,
		height: props.height,
		visible: false,
		position: props.position as 'fixed' | 'absolute' | undefined,
	}),
}))

// Синхронизация общих пропсов со всеми фреймами
watch(
	() => props.width,
	(val) => {
		frames.forEach((f) => {
			f.instance.width = val
		})
	},
)
watch(
	() => props.height,
	(val) => {
		frames.forEach((f) => {
			f.instance.height = val
		})
	},
)
watch(
	() => props.position,
	(val) => {
		frames.forEach((f) => {
			f.instance.position = val ?? 'fixed'
		})
	},
)
// Синхронизация кастомных координат с Custom-фреймом
watch(
	() => props.customX,
	(val) => {
		const custom = frames.find((f) => f.label === 'Custom')
		if (custom) custom.instance.x = val ?? 50
	},
)
watch(
	() => props.customY,
	(val) => {
		const custom = frames.find((f) => f.label === 'Custom')
		if (custom) custom.instance.y = val ?? 50
	},
)

// Каскадные фреймы — 3 шт со смещением
const cascadeOffset = 40
const cascadeBaseX = window.innerWidth / 2 - 140
const cascadeBaseY = window.innerHeight / 2 - 90
const cascadeFrames = [0, 1, 2].map((i) => ({
	label: `Cascade #${i + 1}`,
	instance: new TFrame({
		x: cascadeBaseX + i * cascadeOffset,
		y: cascadeBaseY + i * cascadeOffset,
		width: props.width,
		height: props.height,
		visible: false,
		position: props.position as 'fixed' | 'absolute' | undefined,
	}),
}))

watch(
	() => props.width,
	(val) => {
		cascadeFrames.forEach((f) => {
			f.instance.width = val
		})
	},
)
watch(
	() => props.height,
	(val) => {
		cascadeFrames.forEach((f) => {
			f.instance.height = val
		})
	},
)
watch(
	() => props.position,
	(val) => {
		cascadeFrames.forEach((f) => {
			f.instance.position = val ?? 'fixed'
		})
	},
)

const openCascade = () => {
	cascadeFrames.forEach((f) => f.instance.show())
}

const closeCascade = () => {
	cascadeFrames.forEach((f) => f.instance.hide())
}

const openFrame = (frame: (typeof frames)[0]) => {
	frame.instance.show()
}

const closeFrame = (frame: (typeof frames)[0]) => {
	frame.instance.hide()
}
</script>

<template>
	<PanelDemo title="Frame Positions Demo" style="position: relative">
		<div class="frame-demo__toolbar">
			<Button
				v-for="pos in positions"
				:key="pos.label"
				class="frame-demo__btn"
				:style="{ '--hue': positions.indexOf(pos) * 45 + 'deg' }"
				@click="openFrame(frames[positions.indexOf(pos)])"
			>
				Open {{ pos.label }}
			</Button>

			<Button class="frame-demo__btn frame-demo__btn--cascade" @click="openCascade">
				Open Cascade
			</Button>
		</div>

		<Frame v-for="f in frames" :key="f.label" :ctrl="f.instance">
			<div class="frame-demo__card">
				<div class="frame-demo__card-header">
					<strong>{{ f.label }}</strong>
					<span class="frame-demo__z">z: {{ f.instance.zIndex }}</span>
				</div>
				<p>Position: ({{ f.instance.x }}, {{ f.instance.y }})</p>
				<p>Size: {{ f.instance.width }} × {{ f.instance.height }}</p>
				<Button class="frame-demo__close" @click="closeFrame(f)">Close</Button>
			</div>
		</Frame>

		<!-- Cascade frames — каскадное открытие -->
		<Frame v-for="f in cascadeFrames" :key="f.label" :ctrl="f.instance">
			<div class="frame-demo__card">
				<div class="frame-demo__card-header">
					<strong>{{ f.label }}</strong>
					<span class="frame-demo__z">z: {{ f.instance.zIndex }}</span>
				</div>
				<p>Offset: +{{ cascadeOffset * (cascadeFrames.indexOf(f) + 1) }}px each</p>
				<p>Size: {{ f.instance.width }} × {{ f.instance.height }}</p>
				<div class="frame-demo__card-actions">
					<Button class="frame-demo__close" @click="f.instance.hide()">Close</Button>
					<Button class="frame-demo__close frame-demo__close--all" @click="closeCascade"
						>Close All</Button
					>
				</div>
			</div>
		</Frame>
	</PanelDemo>
</template>

<style lang="scss" scoped>
@reference "./../../../../foundation/tailwind/index.css";
.frame-demo {
	&__toolbar {
		@apply flex flex-wrap justify-center gap-3;

	}

	&__btn {
		@apply px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm;
		@apply transition-colors duration-150;
		background-color: hsl(var(--hue, 200deg), 60%, 50%);

		&:hover {
			background-color: hsl(var(--hue, 200deg), 60%, 40%);
		}

		&--cascade {
			background-color: hsl(280deg, 60%, 50%);

			&:hover {
				background-color: hsl(280deg, 60%, 40%);
			}
		}
	}

	&__card {
		@apply p-4 bg-white rounded-lg shadow-lg border border-gray-200;
		@apply text-sm text-gray-700;
		@apply flex flex-col gap-2;
		min-width: 200px;
	}

	&__card-header {
		@apply flex items-center justify-between;
	}

	&__z {
		@apply text-xs text-gray-400 font-mono;
	}

	&__card-actions {
		@apply flex gap-2 self-end;
	}

	&__close {
		@apply px-3 py-1 text-xs font-medium text-white bg-red-500 rounded;
		@apply hover:bg-red-600 transition-colors duration-150;

		&--all {
			@apply bg-orange-600 hover:bg-orange-700;
		}
	}
}
</style>
