<script setup lang="ts">
import { reactive, defineAsyncComponent } from 'vue'
import { Icon } from '@ui/icon'
import { TIcon } from '@core'

const icon = reactive(new TIcon({ icon: 'home', size: 'normal' }))

const IconHome = defineAsyncComponent(() => import('./../src/packages/icons/home.svg'))
</script>

<template>
	<div class="flex flex-col gap-4">
		<Icon :tag="IconHome" :size="icon.size" />
	</div>
</template>

<style></style>
