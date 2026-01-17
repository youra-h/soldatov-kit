<script setup lang="ts">
import { ComponentView } from '@ui/component-view'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
}

defineProps<Props>()
</script>

<template>
	<div class="slots-demo">
		<!-- Default slot -->
		<ComponentView
			:tag="tag"
			:visible="visible"
			:rendered="rendered"
			class="slots-demo__item slots-demo__item--default"
		>
			<div class="slots-demo__content">
				<div class="slots-demo__title slots-demo__title--purple">Default Slot</div>
				<div class="slots-demo__subtitle">Simple text content</div>
			</div>
		</ComponentView>

		<!-- With multiple children -->
		<ComponentView
			:tag="tag"
			:visible="visible"
			:rendered="rendered"
			class="slots-demo__item slots-demo__item--multiple"
		>
			<div class="slots-demo__content slots-demo__content--spaced">
				<div class="slots-demo__title slots-demo__title--orange">Multiple Children</div>
				<button class="slots-demo__button">Button</button>
				<p class="slots-demo__subtitle">Some paragraph text</p>
			</div>
		</ComponentView>

		<!-- With complex content -->
		<ComponentView
			:tag="tag"
			:visible="visible"
			:rendered="rendered"
			class="slots-demo__item slots-demo__item--complex"
		>
			<div class="slots-demo__grid">
				<div class="slots-demo__grid-item">Item 1</div>
				<div class="slots-demo__grid-item">Item 2</div>
				<div class="slots-demo__grid-item">Item 3</div>
				<div class="slots-demo__grid-item">Item 4</div>
			</div>
		</ComponentView>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.slots-demo {
	$this: &;

	@apply space-y-4;

	&__item {
		@apply border-2 rounded;
		@apply p-3;

		&--default {
			@apply border-purple-500;
		}

		&--multiple {
			@apply border-orange-500;
		}

		&--complex {
			@apply border-pink-500;
		}
	}

	&__content {
		@apply text-center;

		&--spaced {
			@apply space-y-1;
		}
	}

	&__title {
		@apply font-semibold;

		&--purple {
			@apply text-purple-700;
		}

		&--orange {
			@apply text-orange-700;
		}
	}

	&__subtitle {
		@apply text-xs;
		@apply text-gray-600;
	}

	&__button {
		@apply px-2 py-1;
		@apply bg-orange-500;
		@apply text-white;
		@apply rounded;
		@apply text-xs;
	}

	&__grid {
		@apply grid grid-cols-2;
		@apply gap-2;
	}

	&__grid-item {
		@apply bg-pink-100;
		@apply p-2 rounded;
		@apply text-xs text-center;
	}
}
</style>
