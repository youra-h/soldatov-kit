<script setup lang="ts">
import { ref } from 'vue'
import { Presentable } from '@ui/presentable'

const rendered = ref(true)
const visible = ref(true)
</script>

<template>
	<div class="flex flex-col gap-4">
		<h1 class="text-lg font-semibold">Presentable</h1>

		<div class="flex gap-2">
			<button type="button" class="px-2 py-1 border rounded" @click="rendered = !rendered">
				rendered: {{ rendered }}
			</button>
			<button type="button" class="px-2 py-1 border rounded" @click="visible = !visible">
				visible: {{ visible }}
			</button>
		</div>

		<Presentable tag="div" :rendered="rendered" :visible="visible">
			Presentable content
		</Presentable>
	</div>
</template>
