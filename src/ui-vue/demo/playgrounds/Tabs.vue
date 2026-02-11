<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TTabs } from '@core'
import { Tabs } from '@ui/tabs'

const tabs = ref<TTabs>()

onMounted(() => {
	tabs.value = new TTabs()
	tabs.value.collection.add({ id: 1, text: 'Tab 1', value: 'tab1' })
	tabs.value.collection.add({ id: 2, text: 'Tab 2', value: 'tab2' })
	tabs.value.collection.add({ id: 3, text: 'Tab 3', value: 'tab3' })
	tabs.value.collection.setActive(tabs.value.collection.getItem(0)!)
})
</script>

<template>
	<div>
		<h1>Tabs Test</h1>
		<Tabs v-if="tabs" :is="tabs">
			<template #default="{ activeItem }">
				<div v-if="activeItem">
					<p>Active tab: {{ activeItem.text }}</p>
					<p>Value: {{ activeItem.value }}</p>
				</div>
			</template>
		</Tabs>
	</div>
</template>

