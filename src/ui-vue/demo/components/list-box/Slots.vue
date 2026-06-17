<script setup lang="ts">
import { ListBox, ListBoxItem } from '@ui/list-box'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	size?: TComponentSize
	variant?: TComponentVariant
}

defineProps<Props>()

const APPEARANCES = ['plain', 'outlined', 'filled'] as const
</script>

<template>
	<div class="list-box-slots-demo">
		<!-- Appearances -->
		<div v-for="appearance in APPEARANCES" :key="appearance" class="list-box-slots-demo__section">
			<h4 class="list-box-slots-demo__subtitle">{{ appearance }}</h4>

			<ListBox :appearance="appearance" :size="size" :variant="variant">
				<ListBoxItem text="Item 1" value="i1" :selected="true" />
				<ListBoxItem text="Item 2" value="i2" />
				<ListBoxItem text="Item 3" value="i3" />
			</ListBox>
		</div>

		<!-- Single / Multiple mode -->
		<div class="list-box-slots-demo__section">
			<h4 class="list-box-slots-demo__subtitle">mode: multiple</h4>
			<ListBox appearance="outlined" :size="size" :variant="variant" mode="multiple">
				<ListBoxItem text="Multiple — several selected" value="i1" :selected="true" />
				<ListBoxItem text="Item 2" value="i2" :selected="true" />
				<ListBoxItem text="Item 3" value="i3" />
			</ListBox>
		</div>

		<!-- Custom leading/trailing slots -->
		<div class="list-box-slots-demo__section">
			<h4 class="list-box-slots-demo__subtitle">Custom leading/trailing slots</h4>
			<ListBox appearance="outlined" :size="size" :variant="variant">
				<ListBoxItem text="With icon leading" value="i1">
					<template #leading>
						<span class="list-box-slots-demo__badge">⭐</span>
					</template>
				</ListBoxItem>
				<ListBoxItem text="With icon trailing" value="i2">
					<template #trailing>
						<span class="list-box-slots-demo__badge">3</span>
					</template>
				</ListBoxItem>
			</ListBox>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../../foundation/tailwind/index.css";

.list-box-slots-demo {
	@apply flex flex-col gap-8;

	&__section {
		@apply flex flex-col gap-3;
	}

	&__subtitle {
		@apply text-sm font-semibold text-gray-600 uppercase tracking-wide;
	}

	&__badge {
		@apply text-lg;
	}
}
</style>
