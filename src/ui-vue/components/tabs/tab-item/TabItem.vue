<script lang="ts">
import { TTabItem, type ITabItemProps, type ITabItem } from '@core'
import BaseTabItem, { syncTabItem } from './tab-item.component'
import { useInstance } from '../../../composables/useInstance'
import { useBundle } from '../../../composables/useBundle'
import { useInstanceBinding } from '../../../composables/useInstanceBinding'
import { useElementBinding } from '../../../composables/useElementBinding'
import { createComponentViewBundle } from '@plugins'
import { useInjectCollectionItemPlugins } from '../../../composables/useInjectCollectionItemPlugins'
import { Icon, useIconImport } from '../../icon'
import { Button } from '../../button'
import type { TBaseComponentViewProps } from '../../component-view'

export default {
	name: '_TabItem',
	extends: BaseTabItem,
	components: { Icon, Button },
	setup(props: TBaseComponentViewProps<ITabItemProps, ITabItem>, { emit }) {
		const instance = useInstance(TTabItem, props)
		// Инициализация плагинов
		const plugins = useBundle(createComponentViewBundle, props?.plugins)
		// Привязка инстанса к плагинам
		useInstanceBinding(plugins, instance)
		// Привязка элемента и инстанса к плагинам
		const rootRef = useElementBinding(plugins)

		syncTabItem({
			props,
			instance,
			plugins,
			emit,
		})

		useInjectCollectionItemPlugins(instance.uid, plugins)

		const closeIconTag = useIconImport('../../icons/close.svg')

		return { instance, closeIconTag, plugins, rootRef }
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
		:size="instance.size"
		:variant="instance.variant"
		:class="instance.classes.list"
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

	&:focus-visible {
		@apply outline-2 -outline-offset-2 outline-s-component;
	}
}
</style>
