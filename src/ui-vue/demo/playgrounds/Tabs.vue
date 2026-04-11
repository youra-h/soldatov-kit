<script setup lang="ts">
import { ref } from 'vue'
import { TTabs } from '@core'
import { Tabs, TabItem } from '@ui/tabs'

// --- Вариант 1: через instance (программный) ---
const tabs = ref<TTabs>()

tabs.value = new TTabs()
tabs.value.variant = 'primary'
tabs.value.appearance = 'line'
tabs.value.orientation = 'horizontal'

tabs.value.collection.add({ text: 'Tab 1', value: 'tab1' })
tabs.value.collection.add({ text: 'Tab 2', value: 'tab2' })
tabs.value.collection.add({ text: 'Tab 3', value: 'tab3' })

const item2 = tabs.value.collection.findBy('value', 'tab2')!
tabs.value.collection.setActive(item2)

// --- Вариант 2: через prop items ---
const tabItems = ref([
	{ text: 'Alpha', value: 'alpha', active: true },
	{ text: 'Beta', value: 'beta' },
	{ text: 'Gamma', value: 'gamma' },
])
</script>

<template>
	<div style="display: flex; flex-direction: column; gap: 2rem">

		<section>
			<h2>Вариант 1: программный (через instance)</h2>
			<Tabs :is="tabs">
				<template #default="{ activeItem }">
					<div v-if="activeItem" style="padding: 1rem">
						<p>Active: {{ activeItem.text }} ({{ activeItem.value }})</p>
					</div>
				</template>
			</Tabs>
		</section>

		<section>
			<h2>Вариант 2: prop items</h2>
			<Tabs :items="tabItems" appearance="line">
				<template #default="{ activeItem }">
					<div v-if="activeItem" style="padding: 1rem">
						<p>Active: {{ activeItem.text }} ({{ activeItem.value }})</p>
					</div>
				</template>
			</Tabs>
		</section>

		<section>
			<h2>Вариант 3: декларативный (TabItem в слоте)</h2>
			<Tabs appearance="pills">
				<TabItem text="Профиль" value="profile" />
				<TabItem text="Настройки" value="settings" />
				<TabItem text="О проекте" value="about" />
			</Tabs>
		</section>

	</div>
</template>
