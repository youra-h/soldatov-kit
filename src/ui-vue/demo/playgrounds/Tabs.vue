<script setup lang="ts">
import { ref, onMounted, markRaw } from 'vue'
import { TTabs } from '@core'
import { Tabs } from '@ui/tabs'

const tabs1 = ref<TTabs>()

onMounted(() => {
	tabs1.value = new TTabs()

	tabs1.value.variant = 'primary'
	tabs1.value.appearance = 'line'
	tabs1.value.orientation = 'horizontal'

	tabs1.value.collection.add({ id: 1, text: 'Tab 1', value: 'tab1' })
	tabs1.value.collection.add({ id: 2, text: 'Tab 2', value: 'tab2' })
	tabs1.value.collection.add({ id: 3, text: 'Tab 3', value: 'tab3' })

	const item2 = tabs1.value.collection.findBy('id', 2)!

	tabs1.value.collection.setActive(item2)
})
</script>

<template>
	<div>
		<h1>Tabs Test</h1>
		<Tabs :is="tabs1" />
	</div>
</template>
