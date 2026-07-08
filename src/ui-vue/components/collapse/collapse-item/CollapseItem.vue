<script lang="ts">
import { TCollapseItem, type ICollapseItemProps, type ICollapseItem } from '@core'
import BaseCollapseItem, { syncCollapseItem } from './collapse-item.component'
import { useInstance } from '../../../composables/useInstance'
import { useBundle } from '../../../composables/useBundle'
import { useInstanceBinding } from '../../../composables/useInstanceBinding'
import { useElementBinding } from '../../../composables/useElementBinding'
import { useSplitAttrs } from '../../../composables/useSplitAttrs'
import { createComponentViewBundle } from '@plugins'
import { Icon, useIconImport } from '../../icon'
import { Button } from '../../button'
import type { TBaseComponentViewProps } from '../../component-view'

export default {
	name: '_CollapseItem',
	inheritAttrs: false,
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
			view,
			order,
		} = syncCollapseItem({ props, instance, plugins, emit })

		const arrowIconTag = useIconImport('../../../icons/arrow_right.svg')

		const { containerAttrs, controlAttrs } = useSplitAttrs()

		return {
			containerAttrs,
			controlAttrs,
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
			view,
			order,
		}
	},
}
</script>

<template>
	<div
		ref="rootRef"
		v-if="rendered"
		v-show="visible"
		:class="classes"
		:style="{ order }"
		v-bind="containerAttrs"
	>
		<Button
			class="s-collapse-item__header"
			:view="view"
			:disabled="disabled"
			:size="size"
			:variant="variant"
			@click="instance.toggleSelected()"
			v-bind="controlAttrs"
		>
			<template #leading>
				<slot name="leading-icon">
					<Icon
						v-if="arrowPlacement === 'start'"
						:tag="arrowIconTag"
						:size="size"
						class="s-collapse-item__arrow"
					/>
				</slot>
				<slot name="leading" />
			</template>

			<slot name="header" :text="text" :selected="selected">
				{{ text }}
			</slot>

			<template #trailing>
				<slot name="trailing" />
				<slot name="trailing-icon">
					<Icon
						v-if="arrowPlacement === 'end'"
						:tag="arrowIconTag"
						:size="size"
						class="s-collapse-item__arrow"
					/>
				</slot>
			</template>
		</Button>

		<div class="s-collapse-item__body">
			<div class="s-collapse-item__content">
				<slot />
			</div>
		</div>
	</div>
</template>
			</template>
		</Button>

		<div class="s-collapse-item__body">
			<div class="s-collapse-item__content">
				<slot />
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
		@apply w-full justify-start;
		@apply py-2;
	}

	.s-button {
		&__text {
			@apply text-left;
		}
	}

	&__arrow {
		@apply transition-transform duration-300;
		@apply shrink-0;
	}

	&--selected &__arrow {
		@apply rotate-90;
	}

	&__body {
		@apply grid grid-rows-[0fr];
		transition: grid-template-rows 300ms ease;
	}

	&--selected > &__body {
		@apply grid-rows-[1fr];
	}

	&__content {
		@apply overflow-hidden py-0;
		transition: padding 300ms ease;
	}

	&--selected &__content {
		@apply py-2;
	}
}
</style>
