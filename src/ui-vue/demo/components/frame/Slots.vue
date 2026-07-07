<script setup lang="ts">
import { ref } from 'vue'
import { Frame } from '@ui/frame'
import { TFrame } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'

const frame1 = new TFrame({ x: 50, y: 50, width: 250, height: 150 })
const frame2 = new TFrame({ x: 200, y: 100, width: 250, height: 150 })
const frame3 = new TFrame({ x: 350, y: 150, width: 250, height: 150 })
const visible = ref(false)

const toggleAll = () => {
	visible.value = !visible.value
	if (visible.value) {
		frame1.show()
		frame2.show()
		frame3.show()
	} else {
		frame1.hide()
		frame2.hide()
		frame3.hide()
	}
}
</script>

<template>
	<PanelDemo title="Multiple Frames — z-index stacking">
		<div class="frame-demo__container">
			<button class="frame-demo__toggle" @click="toggleAll">
				{{ visible ? 'Hide All' : 'Show All Frames' }}
			</button>

			<!-- Frame 1 — нижний слой -->
			<Frame :ctrl="frame1">
				<div class="frame-demo__card frame-demo__card--1">
					<strong>Frame 1</strong>
					<p>z-index: {{ frame1.zIndex }}</p>
					<p>Shown first → lowest z-index</p>
				</div>
			</Frame>

			<!-- Frame 2 — средний слой -->
			<Frame :ctrl="frame2">
				<div class="frame-demo__card frame-demo__card--2">
					<strong>Frame 2</strong>
					<p>z-index: {{ frame2.zIndex }}</p>
					<p>Shown second → middle z-index</p>
				</div>
			</Frame>

			<!-- Frame 3 — верхний слой (самый высокий z-index) -->
			<Frame :ctrl="frame3">
				<div class="frame-demo__card frame-demo__card--3">
					<strong>Frame 3</strong>
					<p>z-index: {{ frame3.zIndex }}</p>
					<p>Shown last → highest z-index</p>
				</div>
			</Frame>
		</div>
	</PanelDemo>
</template>

<style lang="scss" scoped>
.frame-demo {
	&__container {
		@apply relative w-full h-96 bg-gray-50 rounded border border-dashed border-gray-300;
		@apply flex items-start justify-start p-4;
	}

	&__toggle {
		@apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 z-50;
		@apply absolute top-2 left-2;
	}

	&__card {
		@apply p-3 rounded shadow-md border;
		@apply text-sm;

		&--1 {
			@apply bg-blue-100 border-blue-300;
		}

		&--2 {
			@apply bg-green-100 border-green-300;
		}

		&--3 {
			@apply bg-orange-100 border-orange-300;
		}
	}
}
</style>
