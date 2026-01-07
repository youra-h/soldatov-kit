<script setup lang="ts">
import { reactive } from 'vue'
import { Icon, useIconImport } from '@ui/icon'
import { Button } from '@ui/button'
import { TIcon, TButton } from '@core'

const IconHome = useIconImport('/src/icons/home.svg')
const icon = TIcon.create({ tag: IconHome })
// const icon = new TIcon({ tag: IconHome }) // просто props

const button1 = new TButton({ text: 'Button 3', icon })
const button2 = reactive(TButton.create({ text: 'Button 4', icon: IconHome }))

button1.on('created', (component) => {
	console.log('button1 created', component)
})

button2.on('created', (component) => {
	console.log('button2 created', component)
})

setTimeout(() => {
	button2.loading = true
	button2.disabled = true
}, 1000)

const onCreated = (component) => {
	console.log('onCreated', component)
}
</script>

<template>
	<div class="flex gap-4">
		<Button :icon variant="primary" @created="onCreated" size="lg"> Button 1 </Button>
		<Button :icon="IconHome" variant="primary" loading> Button 2 </Button>
		<Button :is="button1"> Button 3 </Button>
		<Button :is="button2"> Button 4 </Button>
		<Icon :tag="IconHome" />
		<Icon :tag="IconHome" size="auto" />
		<Icon :tag="IconHome" size="sm" />
		<Icon :tag="IconHome" size="lg" />
	</div>
</template>

<style></style>
