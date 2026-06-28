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
			view,
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
			view,
			order,
		}
	},
}
</script>

<template>
	<div ref="rootRef" v-if="rendered" v-show="visible" :class="classes" :style="{ order }">
		<Button
			:tag="tag"
			:view="view"
			:disabled="disabled"
			:size="size"
			:variant="variant"
			:aria-selected="selected"
			@click="instance.click()"
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
