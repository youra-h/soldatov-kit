<script setup lang="ts">
import { reactive, defineAsyncComponent } from 'vue'
import { CheckBox } from '@ui/check-box'
import { Button } from '@ui/button'
import { Icon, useIconImport } from '@ui/icon'
import { TIcon, TCheckBox, TButton } from '@core'

const icon = TIcon.create({ tag: useIconImport('/src/icons/home.svg') })
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="flex gap-4">
			<!-- <Button variant="primary"> Button 1 </Button> -->
			<CheckBox indeterminate :icon />
			<CheckBox indeterminate disabled />
			<CheckBox indeterminate plain />

			<CheckBox :value="true" size="sm" />
			<CheckBox :value="true" size="lg" />
			<CheckBox :value="true" size="xl" />
			<CheckBox :value="true" size="2xl" />
		</div>
		<div class="flex gap-4">
			<CheckBox :value="true" variant="secondary" />
			<CheckBox :value="true" variant="primary" />
			<CheckBox :value="true" variant="success" />
			<CheckBox :value="true" variant="danger" />
			<CheckBox :value="true" variant="warning" />
		</div>
		<div class="flex gap-4">
			<CheckBox :value="true" variant="secondary" disabled />
			<CheckBox :value="true" variant="primary" disabled />
			<CheckBox :value="true" variant="success" disabled />
			<CheckBox :value="true" variant="danger" disabled />
			<CheckBox :value="true" variant="warning" disabled />
		</div>
	</div>
</template>

<style></style>
