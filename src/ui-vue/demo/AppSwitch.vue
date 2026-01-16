<!--
@deprecated Use App.vue instead. Create SwitchPlayground.vue and add to playgrounds map
This file will be removed in the future
-->
<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@ui/switch'
import { Button } from '@ui/button'
import { Icon, useIconImport } from '@ui/icon'
import { TIcon, TSwitch, TButton } from '@core'

const icon = TIcon.create({ tag: useIconImport('/src/icons/home.svg') })
const loading = ref(false)

setTimeout(() => {
	loading.value = true

	setTimeout(() => {
		loading.value = false
	}, 1500)
}, 1500)
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="flex gap-4">
			<Switch :icon :loading />
			<Switch disabled />
			<Switch />
		</div>
		<div class="flex gap-4">
			<Switch :value="true" size="sm" loading />
			<Switch :value="true" size="lg" loading />
			<Switch :value="true" size="xl" loading />
			<Switch :value="true" size="2xl" loading />
		</div>
		<div class="flex gap-4">
			<Switch :value="true" variant="secondary" />
			<Switch :value="true" variant="primary" />
			<Switch :value="true" variant="success" />
			<Switch :value="true" variant="danger" />
			<Switch :value="true" variant="warning" />
		</div>
		<div class="flex gap-4">
			<Switch :value="true" variant="secondary" loading />
			<Switch :value="true" variant="primary" loading />
			<Switch :value="true" variant="success" loading />
			<Switch :value="true" variant="danger" loading />
			<Switch :value="true" variant="warning" loading />
		</div>
		<div class="flex gap-4">
			<Switch :value="true" variant="secondary" disabled />
			<Switch :value="true" variant="primary" disabled />
			<Switch :value="true" variant="success" disabled />
			<Switch :value="true" variant="danger" disabled />
			<Switch :value="true" variant="warning" disabled />
		</div>
		<div class="flex gap-4">
			<Switch variant="secondary" disabled />
			<Switch variant="primary" disabled />
			<Switch variant="success" disabled />
			<Switch variant="danger" disabled />
			<Switch variant="warning" disabled />
		</div>
	</div>
</template>

<style></style>
