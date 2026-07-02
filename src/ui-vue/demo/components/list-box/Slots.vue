<script setup lang="ts">
import { TListBox } from '@core'
import { ListBox, ListBoxItem } from '@ui/list-box'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	size?: TComponentSize
	variant?: TComponentVariant
}

defineProps<Props>()

const APPEARANCES = ['plain', 'outlined', 'filled'] as const

// Instance с предустановленными элементами для #item slot
const fruitInstance = new TListBox({
	items: [
		{ text: 'Apple', value: 'apple' },
		{ text: 'Banana', value: 'banana' },
		{ text: 'Cherry', value: 'cherry', selected: true },
	],
	mode: 'multiple',
})
</script>

<template>
	<div class="list-box-slots-demo">
		<!-- Views -->
		<div v-for="view in APPEARANCES" :key="view" class="list-box-slots-demo__section">
			<h4 class="list-box-slots-demo__subtitle">{{ view }}</h4>

			<ListBox :view="view" :size="size" :variant="variant" mode="single">
				<ListBoxItem text="Item 1" value="i1" :selected="true" />
				<ListBoxItem text="Item 2" value="i2" />
				<ListBoxItem text="Item 3" value="i3" />
			</ListBox>
		</div>

		<!-- Single / Multiple mode -->
		<div class="list-box-slots-demo__section">
			<h4 class="list-box-slots-demo__subtitle">mode: multiple</h4>
			<ListBox view="outlined" :size="size" :variant="variant" mode="multiple">
				<ListBoxItem text="Multiple — several selected" value="i1" :selected="true" />
				<ListBoxItem text="Item 2" value="i2" :selected="true" />
				<ListBoxItem text="Item 3" value="i3" />
			</ListBox>
		</div>

		<!-- #item slot — кастомизация через scoped slot -->
		<div class="list-box-slots-demo__section">
			<h4 class="list-box-slots-demo__subtitle">Custom #item slot</h4>
			<ListBox
				:instance="fruitInstance"
				view="outlined"
				:size="size"
				:variant="variant"
				mode="multiple"
			>
				<template #item="{ ctrl, text, selected }">
					<ListBoxItem :ctrl="ctrl">
						<div class="flex items-center gap-2">
							<input type="checkbox" :checked="selected" class="size-4" readonly />
							<span>{{ text }}</span>
						</div>
					</ListBoxItem>
				</template>
			</ListBox>
		</div>

		<!-- Custom leading/trailing slots -->
		<div class="list-box-slots-demo__section">
			<h4 class="list-box-slots-demo__subtitle">Custom leading/trailing slots</h4>
			<ListBox view="outlined" :size="size" :variant="variant" mode="multiple">
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

		<!-- Per-item slots via ListBox: item:value:leading / item:value:trailing / item:value -->
		<div class="list-box-slots-demo__section">
			<h4 class="list-box-slots-demo__subtitle">Per-item slots via ListBox</h4>
			<ListBox :ctrl="fruitInstance">
				<template #item:apple:leading>
					<span class="list-box-slots-demo__badge">🍎</span>
				</template>
				<template #item:banana:trailing>
					<span class="list-box-slots-demo__badge">🍌</span>
				</template>
				<template #item:cherry="{ item }">
					<span :class="{ 'font-bold': item.selected }">{{ item.text }}</span>
				</template>
			</ListBox>
		</div>

		<!-- #option slot — catch-all template для всех items -->
		<div class="list-box-slots-demo__section">
			<h4 class="list-box-slots-demo__subtitle">Custom #option slot (catch-all)</h4>
			<ListBox :ctrl="fruitInstance" view="outlined" :size="size" :variant="variant">
				<template #item="{ item }">
					<div class="flex items-center gap-2">
						<span>{{ item.selected ? '✅' : '⬜' }}</span>
						<span>{{ item.text }}</span>
						<span class="list-box-slots-demo__badge">{{ item.value }}</span>
					</div>
				</template>
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
