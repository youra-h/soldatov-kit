<script setup lang="ts">
import { ref } from 'vue'
import { TTabs } from '@core'
import { Tabs, TabItem } from '@ui/tabs'

// --- Вариант 1: через instance (программный) ---
const tabs = ref<TTabs>()

tabs.value = new TTabs()
tabs.value.variant = 'accent'
tabs.value.appearance = 'line'
tabs.value.orientation = 'horizontal'

tabs.value.collection.add({ text: 'Tab 1', value: 'tab1', closable: true })
tabs.value.collection.add({ text: 'Tab 2', value: 'tab2', closable: true })
tabs.value.collection.add({ text: 'Tab 3', value: 'tab3', disabled: true })

const item2 = tabs.value.collection.findBy('value', 'tab2')!
tabs.value.collection.setActive(item2)

// --- Вариант 2: через prop items ---
const tabItems = ref([
	{ text: 'Alpha', value: 'alpha', closable: true },
	{ text: 'Beta', value: 'beta', active: true, closable: true },
	{ text: 'Gamma', value: 'gamma', closable: true, disabled: true },
])
</script>

<template>
	<div style="display: flex; flex-direction: column; gap: 2rem">
		<section>
			<h2>Вариант 1: программный (через instance)</h2>
			<Tabs :ctrl="tabs">
				<template #panel:tab1><p>Содержимое Tab 1</p></template>
				<template #panel:tab2><p>Содержимое Tab 2</p></template>
				<template #panel:tab3><p>Содержимое Tab 3</p></template>
			</Tabs>
		</section>

		<section>
			<h2>Вариант 2: prop items</h2>
			<Tabs :items="tabItems" appearance="outline" variant="normal">
				<template #prefix>prefix</template>
				<template #panel:alpha><p>Содержимое Alpha</p></template>
				<template #panel:beta><p>Содержимое Beta</p></template>
				<template #panel:gamma><p>Содержимое Gamma</p></template>
				<template #suffix>suffix</template>
			</Tabs>
		</section>

		<section>
			<h2>Вариант 3: декларативный (TabItem в слоте)</h2>
			<Tabs appearance="contained">
				<template #prefix>prefix</template>
				<TabItem text="Профиль" value="profile" />
				<TabItem text="Настройки" value="settings" active />
				<TabItem text="О проекте" value="about" />
				<template #panel:profile><p>Содержимое Профиль</p></template>
				<template #panel:settings><p>Содержимое Настройки</p></template>
				<template #panel:about><p>Содержимое О проекте</p></template>
				<template #suffix>suffix</template>
			</Tabs>
		</section>

		<section>
			<h2>Вариант 4: вертикальные табы</h2>
			<Tabs appearance="contained" variant="positive">
				<TabItem text="Профиль" value="profile" active />
				<TabItem text="Настройки" value="settings" />
				<TabItem text="О проекте" value="about" />
				<template #panel:profile><p>Содержимое Профиль</p></template>
				<template #panel:settings><p>Содержимое Настройки</p></template>
				<template #panel:about><p>Содержимое О проекте</p></template>
			</Tabs>
		</section>
	</div>
</template>
