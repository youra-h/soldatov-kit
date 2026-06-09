<script setup lang="ts">
import { ref } from 'vue'
import { TLoader } from '@core'
import { Loader } from '@ui/loader'
import { Button } from '@ui/button'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	size?: TComponentSize
	variant?: TComponentVariant
}

defineProps<Props>()

const loaderInstance = new TLoader({ visible: true, type: 'spinner' })
</script>

<template>
	<div class="loader-slots-demo">
		<p class="loader-slots-demo__hint">
			Оберните Loader вокруг любого контрола (Button, CheckBox, ...).
			При visible=true контрол дизейблится и показывает индикатор загрузки в слоте #loader.
		</p>

		<!-- Default: spinner + block -->
		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">Default (spinner + block)</h3>
			<Loader :visible="true" :size="size" :variant="variant">
				<Button>Processing...</Button>
			</Loader>
		</section>

		<!-- indicator=false — только block, без спиннера -->
		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">indicator: false (block only)</h3>
			<Loader :visible="true" :indicator="false" :size="size" :variant="variant">
				<Button>Disabled only</Button>
			</Loader>
		</section>

		<!-- block=false — только спиннер, кликабельно -->
		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">block: false (spinner only)</h3>
			<Loader :visible="true" :block="false" :size="size" :variant="variant">
				<Button>Still clickable</Button>
			</Loader>
		</section>

		<!-- Instance -->
		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">Instance (:ctrl)</h3>
			<Loader :ctrl="loaderInstance" :size="size" :variant="variant">
				<Button>Instance controlled</Button>
			</Loader>
		</section>

		<!-- Not loading (visible=false) -->
		<section class="loader-slots-demo__section">
			<h3 class="loader-slots-demo__title">Idle (visible: false)</h3>
			<Loader :visible="false" :size="size" :variant="variant">
				<Button>Normal button</Button>
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
