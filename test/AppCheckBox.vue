<script setup lang="ts">
import { reactive, defineAsyncComponent } from 'vue'
import { CheckBox } from '@ui/check-box'
import { Button } from '@ui/button'
import { TCheckBox, TButton } from '@core'

const icon = TCheckBox.create()


setTimeout(() => {
}, 1000);
</script>

<template>
	<div class="flex gap-4">
		<Button :icon variant="primary"> Button 1 </Button>
		<CheckBox />
	</div>
</template>

<style></style>
