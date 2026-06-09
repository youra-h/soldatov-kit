<script setup lang="ts">
import { watch } from 'vue'
import { TLoader } from '@core'
import { Loader } from '@ui/loader'
import { Button } from '@ui/button'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	visible?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	block?: boolean
	indicator?: boolean
}

const props = defineProps<Props>()

const loaderInstance = new TLoader({ visible: true, type: 'spinner' })

watch(() => props.visible, (v) => { if (v !== undefined) loaderInstance.visible = v })
watch(() => props.size, (v) => { if (v !== undefined) loaderInstance.size = v })
watch(() => props.variant, (v) => { if (v !== undefined) loaderInstance.variant = v })
watch(() => props.block, (v) => { if (v !== undefined) loaderInstance.block = v })
watch(() => props.indicator, (v) => { if (v !== undefined) loaderInstance.indicator = v })
</script>

<template>
	<div class="loader-slots-demo">
		<p class="loader-slots-demo__hint">
			Оберните Loader вокруг любого контрола (Button, CheckBox, ...). При visible=true контрол
			дизейблится и показывает индикатор загрузки в слоте #loader.
		</p>

		<!-- Default: spinner + block -->
		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">Default (spinner + block)</h3>
			<Loader
				:visible="visible"
				:size="size"
				:variant="variant"
				:block="block"
				:indicator="indicator"
			>
				<Button>Processing...</Button>
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
