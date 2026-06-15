import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import {
	type IList,
	type IListProps,
	type IListItem,
	TList,
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
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsList: TEmits = [
	...emitsControl,
	...emitsSelectableCollection,
	'item:disabled',
	'item:text',
] as const

export const propsList: TProps = {
	...propsControl,
	...propsSelectableCollection,
	mode: {
		type: String as PropType<TSelectionMode>,
		default: TList.defaultValues.mode,
	},
}

export default {
	name: 'BaseList',
	extends: BaseControl,
	emits: emitsList,
	props: propsList,
}

export interface IListState extends IControlState, ISelectableCollectionState<IListItem> {}

export function syncList(
	options: ISyncComponentViewOptions<IListProps & ICollectionProps, IList>,
): IListState {
	const syncPropsControl = syncControl(options)

	const { props, instance, emit, plugins } = options

	const syncPropsSelectableCollection = syncSelectableCollection<IListItem>({
		props: { items: props.items, mode: props.mode! },
		instance: instance.collection,
		emit,
		plugins,
	})

	instance.events.on('item:disabled', (item: IListItem, value: boolean) => {
		emit?.('item:disabled', item, value)
	})

	instance.events.on('item:text', (item: IListItem, value: string) => {
		emit?.('item:text', item, value)
	})

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
		...useSyncProps(instance.events as any, {}),
	}
}
