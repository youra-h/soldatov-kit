<script setup lang="ts">
import { ref, watch } from 'vue'
import { TLoader } from '@core'
import { Loader } from '@ui/loader'
import { Button } from '@ui/button'
import { CheckBox } from '@ui/check-box'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	visible?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	disabled?: boolean
	indicator?: boolean
}

const props = defineProps<Props>()

const LOADING_DURATION = 1500

// Глобальный лоадер (управляется через props панели)
const loaderInstance = new TLoader({ visible: false, type: 'spinner' })

watch(() => props.visible, (v) => { if (v !== undefined) loaderInstance.visible = v })
watch(() => props.size, (v) => { if (v !== undefined) loaderInstance.size = v })
watch(() => props.variant, (v) => { if (v !== undefined) loaderInstance.variant = v })
watch(() => props.disabled, (v) => { if (v !== undefined) loaderInstance.disabled = v })
watch(() => props.indicator, (v) => { if (v !== undefined) loaderInstance.indicator = v })

// Локальные лоадеры (клик → показ на 1.5с)
const buttonLoading = ref(false)
const checkboxLoading = ref(false)

function simulateLoading(target: ReturnType<typeof ref<boolean>>) {
	target.value = true
	setTimeout(() => { target.value = false }, LOADING_DURATION)
}

const onButtonClick = () => simulateLoading(buttonLoading)
const onCheckBoxClick = () => simulateLoading(checkboxLoading)
</script>

<template>
	<div class="loader-slots-demo">
		<p class="loader-slots-demo__hint">
			Оберните Loader вокруг любого контрола (Button, CheckBox, ...). При visible=true контрол
			дизейблится и показывает индикатор загрузки в слоте #loader.
		</p>

		<!-- Глобальное управление через props -->
		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">Button (global props)</h3>
			<Loader
				:visible="visible"
				:size="size"
				:variant="variant"
				:disabled="disabled"
				:indicator="indicator"
			>
				<Button>Processing...</Button>
			</Loader>
		</section>

		<!-- Клик → локальный лоадер на 1.5с -->
		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">Button (click → 1.5s)</h3>
			<Loader
				:visible="buttonLoading"
				:size="size"
				:variant="variant"
				:disabled="disabled"
				:indicator="indicator"
			>
				<Button @click="onButtonClick">Click me</Button>
			</Loader>
		</section>

		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">CheckBox (click → 1.5s)</h3>
			<Loader
				:visible="checkboxLoading"
				:size="size"
				:variant="variant"
				:disabled="disabled"
				:indicator="indicator"
			>
				<CheckBox @click="onCheckBoxClick">Accept terms</CheckBox>
			</Loader>
		</section>

		<!-- Instance -->
		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">Instance (:ctrl)</h3>
			<Loader :ctrl="loaderInstance">
				<Button>Instance controlled</Button>
			</Loader>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../../foundation/tailwind/index.css";

.loader-slots-demo {
	@apply flex flex-col gap-6;

	&__hint {
		@apply text-xs text-gray-500;
	}

	&__section {
		@apply flex flex-col gap-3;
	}

	&__title {
		@apply text-sm font-medium text-gray-600;
	}
}
</style>
