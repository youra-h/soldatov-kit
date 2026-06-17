<script lang="ts">
import { TListBox, type IListBoxProps, type IListBox } from '@core'
import BaseListBox, { syncListBox } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import { useElementBinding } from '../../composables/useElementBinding'
import { createComponentViewBundle } from '@plugins'
import { ListBoxItem } from './list-box-item'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_ListBox',
	extends: BaseListBox,
	components: { ListBoxItem },
	setup(props: TBaseComponentViewProps<IListBoxProps, IListBox>, { emit }) {
		const instance = useInstance(TListBox, props)

		const plugins = useBundle(createComponentViewBundle, props?.plugins)
		useInstanceBinding(plugins, instance)

		const rootRef = useElementBinding(plugins)

		const { rendered, visible, classes, items } = syncListBox({
			props,
			instance,
			plugins,
			emit,
		})

		return {
			instance,
			plugins,
			rootRef,
			rendered,
			visible,
			classes,
			items,
		}
	},
}
</script>

<template>
	<div ref="rootRef" v-if="rendered" v-show="visible" :class="classes">
		<slot>
			<ListBoxItem
				v-for="item in items"
				:key="item.uid"
				:ctrl="item"
			>
				<slot :name="`item:${item.value}`" />
			</ListBoxItem>
		</slot>
	</div>
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind";

.s-list-box {
	@apply flex flex-col;
}
</style>
