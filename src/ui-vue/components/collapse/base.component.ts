import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import {
	type ICollapse,
	type ICollapseProps,
	type ICollapseItem,
	TCollapse,
	type TCollapseView,
	type TSelectionMode,
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
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsCollapse: TEmits = [
	...emitsControl,
	...emitsSelectableCollection,
	'change:view',
	'update:view',
	'item:disabled',
	'item:text',
	'item:rendered',
	'item:visible',
	'item:present',
] as const

export const propsCollapse: TProps = {
	...useInheritProps(propsControl, TCollapse),
	...propsSelectableCollection,
	view: {
		type: String as PropType<TCollapseView>,
		default: TCollapse.defaultValues.view,
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

export interface ICollapseState extends IControlState, ISelectableCollectionState<ICollapseItem> {
	view: Ref<TCollapseView>
}

export function syncCollapse(
	options: ISyncComponentOptions<ICollapseProps<ICollapseItem>, ICollapse>,
): ICollapseState {
	const syncPropsControl = syncControl(options)

	const { props, instance, emit, plugins } = options

	const syncPropsSelectableCollection = syncSelectableCollection<ICollapseItem>({
		props,
		instance: instance.collection,
		emit,
		plugins,
	})

	instance.events.on('change:view', (value: TCollapseView) => {
		emit?.('change:view', value)
		emit?.('update:view', value)
	})

	instance.events.on('item:disabled', (item: ICollapseItem, value: boolean) => {
		emit?.('item:disabled', item, value)
	})

	instance.events.on('item:text', (item: ICollapseItem, value: string) => {
		emit?.('item:text', item, value)
	})

	instance.events.on('item:rendered', (item: ICollapseItem, value: boolean) => {
		emit?.('item:rendered', item, value)
	})

	instance.events.on('item:visible', (item: ICollapseItem, value: boolean) => {
		emit?.('item:visible', item, value)
	})

	instance.events.on('item:present', (item: ICollapseItem, value: boolean) => {
		emit?.('item:present', item, value)
	})

	watch<TCollapseView | undefined>(
		() => props.view,
		(value) => {
			if (value !== undefined && value !== instance.view) {
				instance.view = value
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
		...syncPropsControl,
		...syncPropsSelectableCollection,
		...useSyncProps(instance.events as any, {
			view: () => instance.view,
		}),
	}
}
