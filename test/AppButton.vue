<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Button } from '@ui/button'
import { TButton } from '@core/button'

const button = reactive(new TButton({ text: 'Button 1' }))
button.on('click', () => {
	console.log('Button instance clicked!')
})

const variant = ref('primary')
const appearance = ref('filled')
const text = ref('Button 1')

// setTimeout(() => {
// 	// variant.value = 'danger'
// 	// appearance.value = 'label'
// 	button.variant = 'danger'
// 	console.log('Variant changed to:', button.variant)
// 	// button.appearance = 'label'
// 	appearance.value = 'label'

// 	text.value = 'Updated Text'
// }, 1000)

const onClick = () => {
	button.emit('click')
	console.log('Button clicked!')
}
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="flex gap-4">
			<Button :text disabled></Button>
			<Button :text variant="secondary" disabled></Button>
			<Button :text variant="primary" disabled></Button>
			<Button :text variant="success" disabled></Button>
			<Button :text variant="danger" disabled></Button>
			<Button :text variant="warning" disabled></Button>
		</div>
		<div class="flex gap-4">
			<Button :text></Button>
			<Button :text variant="secondary"></Button>
			<Button :text variant="primary"></Button>
			<Button :text variant="success"></Button>
			<Button :text variant="danger"></Button>
			<Button :text variant="warning"></Button>
		</div>
		<div class="flex gap-4">
			<Button :text appearance="plain"></Button>
			<Button :text appearance="plain" variant="secondary"></Button>
			<Button :text appearance="plain" variant="primary"></Button>
			<Button :text appearance="plain" variant="success"></Button>
			<Button :text appearance="plain" variant="danger"></Button>
			<Button :text appearance="plain" variant="warning"></Button>
		</div>
		<div class="flex gap-4">
			<Button :text appearance="plain" disabled></Button>
			<Button :text appearance="plain" variant="secondary" disabled></Button>
			<Button :text appearance="plain" variant="primary" disabled></Button>
			<Button :text appearance="plain" variant="success" disabled></Button>
			<Button :text appearance="plain" variant="danger" disabled></Button>
			<Button :text appearance="plain" variant="warning" disabled></Button>
		</div>
		<div class="flex gap-4">
			<Button :text appearance="outlined"></Button>
			<Button :text appearance="outlined" variant="secondary"></Button>
			<Button :text appearance="outlined" variant="primary"></Button>
			<Button :text appearance="outlined" variant="success"></Button>
			<Button :text appearance="outlined" variant="danger"></Button>
			<Button :text appearance="outlined" variant="warning"></Button>
		</div>
		<div class="flex gap-4">
			<Button :text appearance="outlined" disabled></Button>
			<Button :text appearance="outlined" variant="secondary" disabled></Button>
			<Button :text appearance="outlined" variant="primary" disabled></Button>
			<Button :text appearance="outlined" variant="success" disabled></Button>
			<Button :text appearance="outlined" variant="danger" disabled></Button>
			<Button :text appearance="outlined" variant="warning" disabled></Button>
		</div>
	</div>
</template>

<style></style>
