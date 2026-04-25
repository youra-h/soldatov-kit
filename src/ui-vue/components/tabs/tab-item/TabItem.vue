<script lang="ts">
import { TTabItem, type ITabItemProps } from '@core'
import BaseTabItem, { syncTabItem } from './tab-item.component'
import { useBaseSetup } from '../../../composables/useBaseSetup'
import { useElementSync } from '../../../composables/useElementSync'
import { Icon, useIconImport } from '../../icon'
import { Button } from '../../button'
import { nextTick } from 'vue'

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

		const rootRef = useElementSync(instance)
		const closeIconTag = useIconImport('../../icons/close.svg')

		nextTick(() => {
			instance.refresh()
		})

		return { instance, closeIconTag, rootRef }
	},
}
</script>

<template>
	<Button
		ref="rootRef"
		:visible="instance.visible"
		:rendered="instance.rendered"
		:disabled="instance.disabled"
		appearance="none"
		:size="size"
		:variant="variant"
		:class="instance.classes"
		@click="instance.click()"
		role="tab"
	>
		<template #before>
			<slot name="before" />
		</template>

		<slot :text="instance.text" :active="instance.active">
			{{ instance.text }}
		</slot>

		<template #after>
			<slot name="after" />
			<Button
				:rendered="!!instance.closable"
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

	@apply opacity-75;
	@apply py-2.5;

	&__close {
		@apply px-1;
	}

	&--active,
	&:hover:not([disabled]) {
		@apply opacity-100;
	}
}
</style>
