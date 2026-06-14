<script setup lang="ts">
import { ref, watch } from 'vue'
import { TLoader } from '@core'
import { Loader } from '@ui/loader'
import { Button } from '@ui/button'
import { CheckBox } from '@ui/check-box'
import { Switch } from '@ui/switch'
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
const switchLoading = ref(false)

function simulateLoading(target: ReturnType<typeof ref<boolean>>) {
	target.value = true
	setTimeout(() => { target.value = false }, LOADING_DURATION)
}

const onButtonClick = () => simulateLoading(buttonLoading)
const onCheckBoxClick = () => simulateLoading(checkboxLoading)
const onSwitchClick = () => simulateLoading(switchLoading)
</script>

<template>
	<div class="loader-slots-demo">
		<p class="loader-slots-demo__hint">
			Оберните Loader вокруг любого контрола. При visible=true контрол дизейблится и показывает
			индикатор загрузки в слоте #loader.
		</p>

		<div class="loader-slots-demo__grid">
			<!-- Левая колонка: управление через props -->
			<div class="loader-slots-demo__col">
				<h3 class="loader-slots-demo__col-title">Props (global)</h3>

				<section class="loader-slots-demo__section">
					<h4 class="loader-slots-demo__title">Button</h4>
					<Loader :visible="visible" :size="size" :variant="variant" :disabled="disabled" :indicator="indicator">
						<Button>Processing...</Button>
					</Loader>
				</section>

				<section class="loader-slots-demo__section">
					<h4 class="loader-slots-demo__title">CheckBox</h4>
					<Loader :visible="visible" :size="size" :variant="variant" :disabled="disabled" :indicator="indicator">
						<CheckBox>Accept terms</CheckBox>
					</Loader>
				</section>

				<section class="loader-slots-demo__section">
					<h4 class="loader-slots-demo__title">Switch</h4>
					<Loader :visible="visible" :size="size" :variant="variant" :disabled="disabled" :indicator="indicator">
						<Switch />
					</Loader>
				</section>
			</div>

			<!-- Правая колонка: клик → лоадер на 1.5с -->
			<div class="loader-slots-demo__col">
				<h3 class="loader-slots-demo__col-title">Click → 1.5s</h3>

				<section class="loader-slots-demo__section">
					<h4 class="loader-slots-demo__title">Button</h4>
					<Loader :visible="buttonLoading" :size="size" :variant="variant" :disabled="disabled" :indicator="indicator">
						<Button @click="onButtonClick">Click me</Button>
					</Loader>
				</section>

				<section class="loader-slots-demo__section">
					<h4 class="loader-slots-demo__title">CheckBox</h4>
					<Loader :visible="checkboxLoading" :size="size" :variant="variant" :disabled="disabled" :indicator="indicator">
						<CheckBox @click="onCheckBoxClick">Accept terms</CheckBox>
					</Loader>
				</section>

				<section class="loader-slots-demo__section">
					<h4 class="loader-slots-demo__title">Switch</h4>
					<Loader :visible="switchLoading" :size="size" :variant="variant" :disabled="disabled" :indicator="indicator">
						<Switch @click="onSwitchClick" />
					</Loader>
				</section>
			</div>
		</div>

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

	&__grid {
		@apply grid grid-cols-2 gap-20;
	}

	&__col {
		@apply flex flex-col gap-4;
	}

	&__col-title {
		@apply text-base font-semibold text-gray-700;
	}

	&__section {
		@apply flex flex-col gap-1.5;
	}

	&__title {
		@apply text-xs font-medium text-gray-500;
	}
}
</style>
