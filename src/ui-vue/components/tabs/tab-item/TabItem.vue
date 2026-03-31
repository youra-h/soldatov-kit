<script lang="ts">
import { TTabItem, type ITabItemProps } from '@core'
import BaseTabItem, { syncTabItem } from './tab-item.component'
import { useBaseSetup } from '../../../composables/useBaseSetup'
import { Icon, useIconImport } from '../../icon'
import { Button } from '../../button'

export default {
	name: '_TabItem',
	extends: BaseTabItem,
	components: { Icon, Button },
	setup(props: ITabItemProps, { emit }) {
		const { is: instance } = useBaseSetup(TTabItem, props)

		syncTabItem({
			props,
			instance,
			emit,
		})

		// Иконка закрытия
		const closeIconTag = useIconImport('../../icons/close.svg')

		return { instance, closeIconTag }
	},
}
</script>

<template>
	<Button
		:visible="instance.visible"
		:rendered="instance.rendered"
		:size="size"
		:variant="variant"
		:class="instance.classes"
		@click="instance.click($event)"
		role="tab"
	>
		<!-- Слот до текста -->
		<template #before>
			<slot name="before" />
		</template>

		<!-- Слот для текста -->
		<slot :text="instance.text" :active="instance.active">
			{{ instance.text }}
		</slot>

		<!-- Слот после текста + кнопка закрытия -->
		<template #after>
			<slot name="after" />

			<!-- Кнопка закрытия -->
			<Button
				:rendered="instance.closable"
				class="s-tab-item__close"
				@click.stop="instance.close()"
				appearance="plain"
			>
				<slot name="close-icon">
					<Icon :tag="closeIconTag" :size="instance.size" />
				</slot>
			</Button>
		</template>
	</Button>
</template>

<style lang="scss">
@reference "./../../../../foundation/tailwind";

.s-tab-item {
	$this: &;

	&__close {
		@apply px-1;
	}
}
</style>
