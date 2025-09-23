<script setup lang="ts">
import { ref } from 'vue'
import { Spinner } from '@ui/spinner'
import { Button } from '@ui/button'
import { TSpinner, TButton } from '@core'

const spinner = new TSpinner({ tag: Spinner })
const loading = ref(false)

setTimeout(() => {
	loading.value = true
}, 2000);
</script>

<template>
	<div class="flex flex-col gap-4">
		<Button variant="primary" :loading> Button 1 </Button>
		<Spinner size="sm" variant="normal" />
		<Spinner variant="primary" />
		<Spinner size="lg" variant="secondary" />
		<Spinner size="xl" variant="success" />
		<Spinner size="2xl" variant="danger" />
		<Spinner size="2xl" variant="warning" />
	</div>
</template>

<style></style>
