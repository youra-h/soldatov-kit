<script setup lang="ts">
import { ref } from 'vue'
import Presentable from '../src/ui-vue/components/presentable/Presentable.vue'

const rendered = ref(true)
const visible = ref(true)
</script>

<template>
	<div>
		<h1 data-testid="e2e-title">E2E Playground</h1>

		<button type="button" data-testid="toggle-rendered" @click="rendered = !rendered">
			rendered: {{ rendered }}
		</button>
		<button type="button" data-testid="toggle-visible" @click="visible = !visible">
			visible: {{ visible }}
		</button>

		<Presentable
			data-testid="presentable"
			:tag="'div'"
			:rendered="rendered"
			:visible="visible"
		>
			Presentable content
		</Presentable>
	</div>
</template>
