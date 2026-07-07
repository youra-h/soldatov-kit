<script setup lang="ts">
import { Frame } from '@ui/frame'
import { Button } from '@ui/button'
import { TFrame } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'

type Props = {
	customX?: number
	customY?: number
	width?: number | string
	height?: number | string
	strategy?: 'fixed' | 'absolute'
}

const props = withDefaults(defineProps<Props>(), {
	customX: 50,
	customY: 50,
	width: 280,
	height: 180,
	strategy: 'fixed',
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
		strategy: props.strategy as 'fixed' | 'absolute' | undefined,
	}),
}))

const openFrame = (frame: (typeof frames)[0]) => {
	frame.instance.show()
}

const closeFrame = (frame: (typeof frames)[0]) => {
	frame.instance.hide()
}
</script>

<template>
	<PanelDemo title="Frame Positions Demo">
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

	&__close {
		@apply self-end px-3 py-1 text-xs font-medium text-white bg-red-500 rounded;
		@apply hover:bg-red-600 transition-colors duration-150;
	}
}
</style>
