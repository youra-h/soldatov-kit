<script lang="ts">
import { TListBoxItem, type IListItemProps, type IListBoxItem } from '@core'
import BaseListBoxItem, { syncListBoxItem } from './list-box-item.component'
import { useInstance } from '../../../composables/useInstance'
import { useBundle } from '../../../composables/useBundle'
import { useInstanceBinding } from '../../../composables/useInstanceBinding'
import { useElementBinding } from '../../../composables/useElementBinding'
import { useSplitAttrs } from '../../../composables/useSplitAttrs'
import { createListItemBundle } from '@plugins'
import { Button } from '../../button'
import type { TBaseComponentViewProps } from '../../component-view'

export default {
	name: '_ListBoxItem',
	inheritAttrs: false,
	extends: BaseListBoxItem,
	components: { Button },
	setup(props: TBaseComponentViewProps<IListItemProps, IListBoxItem>, { emit }) {
		const instance = useInstance(TListBoxItem, props)

		const plugins = useBundle(createListItemBundle, props?.plugins)
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
			view,
			order,
			highlighted,
		} = syncListBoxItem({ props, instance, plugins, emit })

		const { containerAttrs, controlAttrs } = useSplitAttrs()

		return {
			containerAttrs,
			controlAttrs,
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
			highlighted,
			view,
			order,
		}
	},
}
</script>

<template>
	<div ref="rootRef" v-if="rendered" v-show="visible" :class="classes" :style="{ order }" v-bind="containerAttrs">
		<Button
			:tag="tag"
			:view="view"
			:disabled="disabled"
			:size="size"
			:variant="variant"
			:aria-selected="selected"
			:data-highlighted="highlighted"
			@click="instance.toggleSelected()"
			v-bind="controlAttrs"
		>
			<template #leading>
				<slot name="leading" />
			</template>

			<slot name="default" :text="text" :selected="selected">
				{{ text }}
			</slot>

			<template #trailing>
				<slot name="trailing" />
			</template>
		</Button>
	</div>
</template>

<style lang="scss">
@reference "./../../../../foundation/tailwind";

.s-list-box-item {
	@apply min-h-fit;

	.s-button {
		&__text {
			@apply text-left min-w-0;
		}
	}

	&--word-wrap {
		.s-button {
			&__text {
				@apply whitespace-normal overflow-visible;
			}
		}
	}
}
</style>
