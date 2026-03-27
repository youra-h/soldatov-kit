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
		:text="instance.text"
		:class="instance.classes"
		@click="instance.click($event)"
		role="tab"
	>
		<template #after>
			<!-- Кнопка закрытия -->
			<Button
				:rendered="instance.closable"
				class="s-tab-item__close"
				@click.stop="instance.close()"
				appearance="plain"
			>
				<Icon :tag="closeIconTag" :size="instance.size" />
			</Button>
		</template>
	</Button>
</template>

<style lang="scss">
@reference "./../../../../foundation/tailwind";

.s-tab-item {
	$this: &;

	@apply inline-flex items-center gap-2;
	@apply px-4 py-2;
	@apply cursor-pointer select-none;
	@apply relative;

	&__text {
		@apply inline-flex items-center;
	}

	&__close {
		@apply px-1;
	}

	&--closable {
		@apply pr-2;
	}

	&:disabled,
	&--disabled {
		@apply opacity-50 cursor-default pointer-events-none;
	}
}
</style>
