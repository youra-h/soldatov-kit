<script setup lang="ts">
import { reactive, defineAsyncComponent } from 'vue'
import { CheckBox } from '@ui/check-box'
import { Button } from '@ui/button'
import { TCheckBox, TButton } from '@core'
</script>

<template>
	<div class="flex gap-4">
		<!-- <Button variant="primary"> Button 1 </Button> -->
		<CheckBox indeterminate />
		<CheckBox indeterminate disabled />
		<CheckBox indeterminate plain />
	</div>
</template>

<style></style>
