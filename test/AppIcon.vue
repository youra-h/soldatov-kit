<script setup lang="ts">
import { reactive, defineAsyncComponent } from 'vue'
import { Icon } from '@ui/icon'
import { Button } from '@ui/button'
import { TIcon, TButton } from '@core'

const IconHome = defineAsyncComponent(() => import('./../src/packages/icons/home.svg'))

// debugger
const icon = new TIcon({ tag: IconHome })

console.log(icon);
</script>

<template>
	<div class="flex flex-col gap-4">
		<Button class="w-34" :icon variant="primary"> Button 1 </Button>
		<Icon :tag="IconHome" />
		<Icon :tag="IconHome" size="auto" />
		<Icon :tag="IconHome" size="sm" />
		<Icon :tag="IconHome" size="lg" />
	</div>
</template>

<style></style>
