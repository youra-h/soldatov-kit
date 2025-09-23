<script setup lang="ts">
import { ref } from 'vue'
import { Spinner } from '@ui/spinner'
import { Button } from '@ui/button'
import { TSpinner, TButton } from '@core'

const spinner = new TSpinner({ tag: Spinner })
const button = new TButton({ variant: 'danger', spinner, loading: true })

const loading = ref(false)
const variant = ref('normal')
const size = ref('normal')

setTimeout(() => {
	loading.value = true
	variant.value = 'primary'
	size.value = 'lg'
}, 2000)
</script>

<template>
	<div class="flex gap-4">
		<Button :variant :loading :size> Button 1 </Button>
		<Button :is="button">Button 2</Button>
		<Spinner size="sm" variant="normal" />
		<Spinner variant="primary" />
		<Spinner size="lg" variant="secondary" />
		<Spinner size="xl" variant="success" />
		<Spinner size="2xl" variant="danger" />
		<Spinner size="2xl" variant="warning" />
	</div>
</template>

<style></style>
