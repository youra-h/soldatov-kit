<script setup lang="ts">
import { reactive, defineAsyncComponent } from 'vue'
import { Switch } from '@ui/switch'
import { Button } from '@ui/button'
import { Icon, useIconImport } from '@ui/icon'
import { TIcon, TSwitch, TButton } from '@core'

const icon = TIcon.create({ tag: useIconImport('/src/packages/icons/home.svg') })
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="flex gap-4">
			<!-- <Button variant="primary"> Button 1 </Button> -->
			<Switch :icon />
			<Switch disabled />
			<Switch />

			<Switch :value="true" size="sm" />
			<Switch :value="true" size="lg" />
			<Switch :value="true" size="xl" />
			<Switch :value="true" size="2xl" />
		</div>
		<div class="flex gap-4">
			<Switch :value="true" variant="secondary" />
			<Switch :value="true" variant="primary" />
			<Switch :value="true" variant="success" />
			<Switch :value="true" variant="danger" />
			<Switch :value="true" variant="warning" />
		</div>
		<div class="flex gap-4">
			<Switch :value="true" variant="secondary" disabled />
			<Switch :value="true" variant="primary" disabled />
			<Switch :value="true" variant="success" disabled />
			<Switch :value="true" variant="danger" disabled />
			<Switch :value="true" variant="warning" disabled />
		</div>
	</div>
</template>

<style></style>
