<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@ui/button'
import { TButton } from '@core/button'

const button = new TButton({ variant: 'warning', appearance: 'filled' })
button.on('click', () => {
	console.log('Button instance clicked!')
})

const variant = ref('primary')
const appearance = ref('filled')

setTimeout(() => {
	variant.value = 'danger'
	// appearance.value = 'label'
}, 1000)

const onClick = () => {
	button.emit('click')
	console.log('Button clicked!')
}
</script>

<template>
	<Button :component="button" :variant="variant" :appearance="appearance" @click="onClick">Click Me</Button>
</template>

<style></style>
