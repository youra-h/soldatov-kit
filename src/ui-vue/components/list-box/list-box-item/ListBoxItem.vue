<script lang="ts">
import { TListBoxItem, type IListItemProps, type IListBoxItem } from '@core'
import BaseListBoxItem, { syncListBoxItem } from './list-box-item.component'
import { useInstance } from '../../../composables/useInstance'
import { useBundle } from '../../../composables/useBundle'
import { useInstanceBinding } from '../../../composables/useInstanceBinding'
import { useElementBinding } from '../../../composables/useElementBinding'
import { createComponentViewBundle } from '@plugins'
import { Button } from '../../button'
import type { TBaseComponentViewProps } from '../../component-view'

export default {
	name: '_ListBoxItem',
	extends: BaseListBoxItem,
	components: { Button },
	setup(props: TBaseComponentViewProps<IListItemProps, IListBoxItem>, { emit }) {
		const instance = useInstance(TListBoxItem, props)

		const plugins = useBundle(createComponentViewBundle, props?.plugins)
		useInstanceBinding(plugins, instance)

		const rootRef = useElementBinding(plugins)

		const {
			tag,
			rendered,
			visible,
			classes,
			disabled,
			size,
			variant,
			text,
			selected,
			appearance,
			order,
		} = syncListBoxItem({ props, instance, plugins, emit })

		return {
			instance,
			plugins,
			rootRef,
			tag,
			rendered,
			visible,
			classes,
			disabled,
			size,
			variant,
			text,
			selected,
			appearance,
			order,
		}
	},
}
</script>

<template>
	<Button
		ref="rootRef"
		v-if="rendered"
		v-show="visible"
		:class="classes"
		:style="{ order }"
		:tag="tag"
		:appearance="appearance"
		:disabled="disabled"
		:size="size"
		:variant="variant"
		@click="instance.click()"
	>
		<template #leading>
			<slot name="leading" />
		</template>

		<span class="s-list-box-item__text">
			<slot name="default" :text="text" :selected="selected">
				{{ text }}
			</slot>
		</span>

		<template #trailing>
			<slot name="trailing" />
		</template>
	</Button>
</template>

<style lang="scss">
@reference "./../../../../foundation/tailwind";

.s-list-box-item {
	@apply flex;
}
</style>
