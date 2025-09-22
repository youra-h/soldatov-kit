<script setup lang="ts">
import { Spinner } from '@ui/spinner'
import { Button } from '@ui/button'
import { TSpinner, TButton } from '@core'

const spinner = new TSpinner({ tag: Spinner })
</script>

<template>
	<div class="flex flex-col gap-4">
		<Button variant="primary"> Button 1 </Button>
		<Spinner size="sm" variant="normal" />
		<Spinner variant="primary" />
		<Spinner size="lg" variant="secondary" />
		<Spinner size="xl" variant="success" />
		<Spinner size="2xl" variant="danger" />
		<Spinner size="2xl" variant="warning" />
	</div>
</template>

<style></style>
