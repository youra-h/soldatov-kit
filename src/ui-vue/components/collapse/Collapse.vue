<script lang="ts">
import { TCollapse, type ICollapseProps, type ICollapse } from '@core'
import BaseCollapse, { syncCollapse } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import { createCollapseBundle } from '@plugins'
import { CollapseItem } from './collapse-item'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Collapse',
	extends: BaseCollapse,
	components: { CollapseItem },
	setup(props: TBaseComponentViewProps<ICollapseProps, ICollapse>, { emit }) {
		const instance = useInstance(TCollapse, props)

		const plugins = useBundle(createCollapseBundle, props?.plugins)
		useInstanceBinding(plugins, instance)

		const rootRef = useElementBinding(plugins)

		const { rendered, visible, classes, items, view, mode, selected } = syncCollapse({
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
			view,
			mode,
			selected,
		}
	},
}
</script>

<template>
	<div ref="rootRef" v-if="rendered" v-show="visible" :class="classes">
		<slot>
			<CollapseItem v-for="item in items" :key="item.uid" :ctrl="item" :view="view">
				<template #leading>
					<slot :name="`item:${item.value}:leading`" :item="item" />
				</template>
				<template #header>
					<slot :name="`item:${item.value}:header`" :item="item">
						<slot name="item" :item="item" />
					</slot>
				</template>
				<template #trailing>
					<slot :name="`item:${item.value}:trailing`" :item="item" />
				</template>
				<slot :name="`panel:${item.value}`" />
			</CollapseItem>
		</slot>
	</div>
</template>

<style lang="scss">
@use './_mixines' as mixines;
@reference "./../../../foundation/tailwind";

.s-collapse {
	$this: &;

	@apply flex flex-col gap-1;
}
</style>
