<script setup lang="ts">
import { reactive, defineAsyncComponent } from 'vue'
import { Icon } from '@ui/icon'
import { Button } from '@ui/button'
import { TIcon, TButton } from '@core'

const IconHome = defineAsyncComponent(() => import('./../src/packages/icons/home.svg'))

const icon = new TIcon({ tag: IconHome })

const button1 = new TButton({ text: 'Button 3', icon })
const button2 = new TButton({ text: 'Button 4', icon: IconHome })

console.log('qwe', icon)
</script>

<template>
	<div class="flex gap-4">
		<Button :icon variant="primary"> Button 1 </Button>
		<Button :icon="IconHome" variant="primary" loading> Button 2 </Button>
		<Button :is="button1"> Button 3 </Button>
		<Button :is="button2"> Button 4 </Button>
		<Icon :tag="IconHome" />
		<Icon :tag="IconHome" size="auto" />
		<Icon :tag="IconHome" size="sm" />
		<Icon :tag="IconHome" size="lg" />
	</div>
</template>

<style></style>
