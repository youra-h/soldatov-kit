<script lang="ts">
import { TCollapse, type ICollapseProps, type ICollapse } from '@core'
import BaseCollapse, { syncCollapse } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import { useProvideCollection } from '../../composables/useProvideCollection'
import { useProvideCollectionPlugins } from '../../composables/useProvideCollectionPlugins'
import { createCollapseBundle } from '@plugins'
import { CollapseItem } from './collapse-item'
import {
	TCollectionElementsPlugin,
	TCollectionInstancesPlugin,
} from '../../../plugins/common/collection'
import type { TBaseComponentViewProps } from '../component-view'
import type { IPluginBundle } from '../../../plugins/base'

export default {
	name: '_Collapse',
	extends: BaseCollapse,
	components: { CollapseItem },
	setup(props: TBaseComponentViewProps<ICollapseProps, ICollapse>, { emit }) {
		const instance = useInstance(TCollapse, props)
		const plugins = useBundle(createCollapseBundle, props?.plugins)
		useInstanceBinding(plugins, instance)
		const rootRef = useElementBinding(plugins)

		useProvideCollection(instance.collection)

		// Регистрируем дочерние элементы в плагинах коллекции
		useProvideCollectionPlugins((uid: string | number, childBundle: IPluginBundle) => {
			plugins.get(TCollectionElementsPlugin)?.register(uid, childBundle)
			plugins.get(TCollectionInstancesPlugin)?.register(uid, childBundle)
		})

		const { rendered, visible, classes, items, appearance, mode, selected } = syncCollapse({
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
			appearance,
			mode,
			selected,
		}
	},
}
</script>

<template>
	<div ref="rootRef" v-if="rendered" v-show="visible" :class="classes">
		<slot>
			<CollapseItem v-for="item in items" :key="item.uid" :ctrl="item" />
		</slot>
	</div>
</template>

<style lang="scss">
@use './_mixines' as mixines;
@reference "./../../../foundation/tailwind";

.s-collapse {
	$this: &;

	@apply flex flex-col w-full;

	// Appearance: plain — без рамки, без фона
	&--plain {
		.s-collapse-item {
			@apply border-b border-s-neutral-200 last:border-b-0;
		}

		.s-collapse-item__header {
			@apply bg-transparent;

			&:hover:not([disabled]) {
				@apply bg-s-neutral-100;
			}
		}
	}

	// Appearance: outlined — общая рамка вокруг + разделители
	&--outlined {
		@apply border border-s-neutral-200 rounded-md overflow-hidden;

		.s-collapse-item {
			@apply border-b border-s-neutral-200 last:border-b-0;
		}

		.s-collapse-item__header {
			@apply bg-transparent;

			&:hover:not([disabled]) {
				@apply bg-s-neutral-100;
			}
		}
	}

	// Appearance: filled — фоновые карточки
	&--filled {
		@apply gap-2;

		.s-collapse-item {
			@apply rounded-md overflow-hidden;
			@apply bg-s-neutral-100;
		}

		.s-collapse-item__header {
			@apply bg-transparent;

			&:hover:not([disabled]) {
				@apply bg-s-neutral-200;
			}
		}
	}
}
</style>
