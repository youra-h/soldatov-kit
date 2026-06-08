<script lang="ts">
import { TCollapseItem, type ICollapseItemProps, type ICollapseItem } from '@core'
import BaseCollapseItem, { syncCollapseItem } from './collapse-item.component'
import { useInstance } from '../../../composables/useInstance'
import { useBundle } from '../../../composables/useBundle'
import { useInstanceBinding } from '../../../composables/useInstanceBinding'
import { useElementBinding } from '../../../composables/useElementBinding'
import { createComponentViewBundle } from '@plugins'
import { Icon, useIconImport } from '../../icon'
import { Button } from '../../button'
import type { TBaseComponentViewProps } from '../../component-view'

export default {
	name: '_CollapseItem',
	extends: BaseCollapseItem,
	components: { Icon, Button },
	setup(props: TBaseComponentViewProps<ICollapseItemProps, ICollapseItem>, { emit }) {
		const instance = useInstance(TCollapseItem, props)

		const plugins = useBundle(createComponentViewBundle, props?.plugins)
		useInstanceBinding(plugins, instance)

		const rootRef = useElementBinding(plugins)

		const {
			rendered,
			visible,
			classes,
			disabled,
			size,
			variant,
			text,
			selected,
			arrowPlacement,
			appearance,
		} = syncCollapseItem({ props, instance, plugins, emit })

		const arrowIconTag = useIconImport('../../../icons/arrow_right.svg')

		return {
			instance,
			arrowIconTag,
			plugins,
			rootRef,
			rendered,
			visible,
			classes,
			disabled,
			size,
			variant,
			text,
			selected,
			arrowPlacement,
			appearance,
		}
	},
}
</script>

<template>
	{{ console.log(appearance) }}
	<div ref="rootRef" v-if="rendered" v-show="visible" :class="classes">
		<Button
			class="s-collapse-item__header"
			appearance="appearance"
			:disabled="disabled"
			:size="size"
			:variant="variant"
			@click="instance.click()"
		>
			<template #leading>
				<slot name="leading" />
				<Icon
					v-if="arrowPlacement === 'start'"
					:tag="arrowIconTag"
					:size="size"
					class="s-collapse-item__arrow"
					:class="{ 's-collapse-item__arrow--open': selected }"
				/>
			</template>

			<slot :text="text" :selected="selected">
				{{ text }}
			</slot>

			<template #trailing>
				<slot name="trailing" />
				<Icon
					v-if="arrowPlacement === 'end'"
					:tag="arrowIconTag"
					:size="size"
					class="s-collapse-item__arrow"
					:class="{ 's-collapse-item__arrow--open': selected }"
				/>
			</template>
		</Button>

		<div class="s-collapse-item__body">
			<div class="s-collapse-item__content">
				<slot name="content" />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@reference "./../../../../foundation/tailwind";

.s-collapse-item {
	$this: &;

	@apply flex flex-col w-full;

	&__header {
		@apply w-full justify-between rounded-none;
		@apply px-3 py-2.5;
	}

	&__arrow {
		@apply transition-transform duration-300;
		@apply shrink-0;

		&--open {
			@apply rotate-90;
		}
	}

	&__body {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 300ms ease;
	}

	&--open > &__body {
		grid-template-rows: 1fr;
	}

	&__content {
		overflow: hidden;
		@apply px-3 py-2;
	}
}
</style>
