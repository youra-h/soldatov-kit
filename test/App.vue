<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Button } from '@ui/button'
import { TButton } from '@core/button'

const button = reactive(new TButton({ variant: 'primary', appearance: 'filled', text: 'Click Me' }))
button.on('click', () => {
	console.log('Button instance clicked!')
})

const variant = ref('primary')
const appearance = ref('filled')
const text = ref('Click Me')

setTimeout(() => {
	// variant.value = 'danger'
	// appearance.value = 'label'
	button.variant = 'danger'
	console.log('Variant changed to:', button.variant)
	// button.appearance = 'label'
	appearance.value = 'label'

	text.value = 'Updated Text'
}, 1000)

const onClick = () => {
	button.emit('click')
	console.log('Button clicked!')
}
</script>

<template>
	<!-- <Button @click="onClick" :component="button" :variant="button.variant" :appearance="button.appearance" :text="text"></Button> -->
	<br />
	<Button :component="button" :text="text" :appearance="appearance"></Button>
</template>

<style></style>
