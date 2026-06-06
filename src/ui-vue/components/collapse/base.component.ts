import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import {
	type ICollapse,
	type ICollapseProps,
	type ICollapseItem,
	TCollapse,
	type TCollapseAppearance,
	type TSelectionMode,
	type ICollectionProps,
} from '@core'
import {
	BaseControl,
	emitsControl,
	propsControl,
	syncControl,
	type IControlState,
} from '../control'
import {
	emitsSelectableCollection,
	syncSelectableCollection,
	propsSelectableCollection,
	type ISelectableCollectionState,
} from '../collection/selectable'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsCollapse: TEmits = [
	...emitsControl,
	...emitsSelectableCollection,
	'change:appearance',
	'update:appearance',
	'item:disabled',
] as const

export const propsCollapse: TProps = {
	...propsControl,
	...propsSelectableCollection,
	appearance: {
		type: String as PropType<TCollapseAppearance>,
		default: TCollapse.defaultValues.appearance,
	},
	mode: {
		type: String as PropType<TSelectionMode>,
		default: TCollapse.defaultValues.mode,
	},
}

export default {
	name: 'BaseCollapse',
	extends: BaseControl,
	emits: emitsCollapse,
	props: propsCollapse,
}

export interface ICollapseState extends IControlState {
	appearance: Ref<TCollapseAppearance>
	mode: Ref<TSelectionMode>
	selected: Ref<ICollapseItem[]>
	selectedCount: Ref<number>
	items: Ref<ICollapseItem[]>
}

export function syncCollapse(
	options: ISyncComponentModelOptions<ICollapseProps & ICollectionProps, ICollapse>,
): ICollapseState {
	const syncProps = syncControl(options)

	const { props, instance, emit, plugins } = options

	const syncPropsSelectable = syncSelectableCollection({
		props: { items: props.items, mode: props.mode },
		instance: instance.collection,
		emit,
		plugins,
	})

	instance.events.on('change:appearance', (value: TCollapseAppearance) => {
		emit?.('change:appearance', value)
		emit?.('update:appearance', value)
	})

	instance.events.on('item:disabled', (item: ICollapseItem, value: boolean) => {
		emit?.('item:disabled', item, value)
	})

	watch<TCollapseAppearance | undefined>(
		() => props.appearance,
		(value) => {
			if (value !== undefined && value !== instance.appearance) {
				instance.appearance = value
			}
		},
	)

	watch<TSelectionMode | undefined>(
		() => props.mode,
		(value) => {
			if (value !== undefined && value !== instance.mode) {
				instance.mode = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			appearance: {
				value: () => instance.appearance,
				events: ['change:appearance'],
			},
		}),
		mode: syncPropsSelectable.mode,
		selected: syncPropsSelectable.selected,
		selectedCount: syncPropsSelectable.selectedCount,
		items: syncPropsSelectable.items as Ref<ICollapseItem[]>,
	}
}
