<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Button } from '@ui/button'
import { TButton } from '@core'

const button = reactive(new TButton({ text: 'Button 1' }))
button.events.on('click', () => {
	console.log('Button instance clicked!')
})

const variant = ref('primary')
const appearance = ref('filled')
const text = ref('Button 1')
const visible = ref(true)
const size = ref('lg')

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
	console.log('Button clicked!')
	visible.value = !visible.value
}
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="flex gap-4">
			<Button :text @click="onClick" size="sm"></Button>
			<Button :text variant="secondary" :visible size="sm"></Button>
			<Button :text variant="primary" size="sm"></Button>
			<Button :text variant="success" size="sm"></Button>
			<Button :text variant="danger" size="sm"></Button>
			<Button :text variant="warning" size="sm"></Button>
		</div>
		<div class="flex gap-4">
			<Button :text @click="onClick"></Button>
			<Button :text variant="secondary" :visible></Button>
			<Button :text variant="primary"></Button>
			<Button :text variant="success"></Button>
			<Button :text variant="danger"></Button>
			<Button :text variant="warning"></Button>
		</div>
		<div class="flex gap-4">
			<Button :text disabled :size></Button>
			<Button :text variant="secondary" disabled :size></Button>
			<Button :text variant="primary" disabled :size></Button>
			<Button :text variant="success" disabled :size></Button>
			<Button :text variant="danger" disabled :size></Button>
			<Button :text variant="warning" disabled :size></Button>
		</div>
		<div class="flex gap-4">
			<Button :text @click="onClick" :size></Button>
			<Button :text variant="secondary" :visible :size></Button>
			<Button :text variant="primary" :size></Button>
			<Button :text variant="success" :size></Button>
			<Button :text variant="danger" :size></Button>
			<Button :text variant="warning" :size></Button>
		</div>
		<div class="flex gap-4">
			<Button :text appearance="plain" :size></Button>
			<Button :text appearance="plain" variant="secondary" :size></Button>
			<Button :text appearance="plain" variant="primary" :size></Button>
			<Button :text appearance="plain" variant="success" :size></Button>
			<Button :text appearance="plain" variant="danger" :size></Button>
			<Button :text appearance="plain" variant="warning" :size></Button>
		</div>
		<div class="flex gap-4">
			<Button :text appearance="plain" disabled :size></Button>
			<Button :text appearance="plain" variant="secondary" disabled :size></Button>
			<Button :text appearance="plain" variant="primary" disabled :size></Button>
			<Button :text appearance="plain" variant="success" disabled :size></Button>
			<Button :text appearance="plain" variant="danger" disabled :size></Button>
			<Button :text appearance="plain" variant="warning" disabled :size></Button>
		</div>
		<div class="flex gap-4">
			<Button :text appearance="outlined" :size></Button>
			<Button :text appearance="outlined" variant="secondary" :size></Button>
			<Button :text appearance="outlined" variant="primary" :size></Button>
			<Button :text appearance="outlined" variant="success" :size></Button>
			<Button :text appearance="outlined" variant="danger" :size></Button>
			<Button :text appearance="outlined" variant="warning" :size></Button>
		</div>
		<div class="flex gap-4">
			<Button :text appearance="outlined" disabled :size></Button>
			<Button :text appearance="outlined" variant="secondary" disabled :size></Button>
			<Button :text appearance="outlined" variant="primary" disabled :size></Button>
			<Button :text appearance="outlined" variant="success" disabled :size></Button>
			<Button :text appearance="outlined" variant="danger" disabled :size></Button>
			<Button :text appearance="outlined" variant="warning" disabled :size></Button>
		</div>
	</div>
</template>

<style></style>
