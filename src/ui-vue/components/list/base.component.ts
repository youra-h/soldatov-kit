import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import {
	type IList,
	type IListProps,
	type IListItem,
	TList,
	type TSelectionMode,
	type TScrollBehavior,
	type ICollectionSource,
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

export const emitsList: TEmits = [
	...emitsControl,
	...emitsSelectableCollection,
	'change:maxRows',
	'update:maxRows',
	'change:autoWidth',
	'update:autoWidth',
	'change:wordWrap',
	'update:wordWrap',
	'change:scrollBehavior',
	'update:scrollBehavior',
	'item:disabled',
	'item:text',
	'item:rendered',
	'item:visible',
	'item:present',
] as const

export const propsList: TProps = {
	...useInheritProps(propsControl, TList),
	...propsSelectableCollection,
	mode: {
		type: String as PropType<TSelectionMode>,
		default: TList.defaultValues.mode,
	},
	maxRows: {
		type: Number as PropType<IListProps['maxRows']>,
		default: TList.defaultValues.maxRows,
	},
	autoWidth: {
		type: Boolean as PropType<IListProps['autoWidth']>,
		default: TList.defaultValues.autoWidth,
	},
	wordWrap: {
		type: Boolean as PropType<IListProps['wordWrap']>,
		default: TList.defaultValues.wordWrap,
	},
	scrollBehavior: {
		type: String as PropType<TScrollBehavior>,
		default: TList.defaultValues.scrollBehavior,
	},
}

export default {
	name: 'BaseList',
	extends: BaseControl,
	emits: emitsList,
	props: propsList,
}

export interface IListState<TItem extends IListItem = IListItem>
	extends IControlState, ISelectableCollectionState<TItem> {}

export function syncList<TItem extends IListItem = IListItem>(
	options: ISyncComponentOptions<IListProps<TItem> & ICollectionSource<TItem>, IList<TItem>>,
): IListState<TItem> {
	const syncPropsControl = syncControl(options)

	const { props, instance, emit, plugins } = options

	const syncPropsSelectableCollection = syncSelectableCollection<TItem>({
		props,
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

	instance.events.on('item:rendered', (item: IListItem, value: boolean) => {
		emit?.('item:rendered', item, value)
	})

	instance.events.on('item:visible', (item: IListItem, value: boolean) => {
		emit?.('item:visible', item, value)
	})

	instance.events.on('item:present', (item: IListItem, value: boolean) => {
		emit?.('item:present', item, value)
	})

	instance.events.on('change:maxRows', (value: number) => {
		emit?.('change:maxRows', value)
		emit?.('update:maxRows', value)
	})

	instance.events.on('change:autoWidth', (value: boolean) => {
		emit?.('change:autoWidth', value)
		emit?.('update:autoWidth', value)
	})

	instance.events.on('change:wordWrap', (value: boolean) => {
		emit?.('change:wordWrap', value)
		emit?.('update:wordWrap', value)
	})

	instance.events.on('change:scrollBehavior', (value: TScrollBehavior) => {
		emit?.('change:scrollBehavior', value)
		emit?.('update:scrollBehavior', value)
	})

	watch(
		() => props.mode,
		(value) => {
			if (value !== undefined && value !== instance.mode) {
				instance.mode = value
			}
		},
		{ immediate: true },
	)

	watch(
		() => props.maxRows,
		(value) => {
			if (value !== undefined && value !== instance.maxRows) {
				instance.maxRows = value
			}
		},
		{ immediate: true },
	)

	watch(
		() => props.autoWidth,
		(value) => {
			if (value !== undefined && value !== instance.autoWidth) {
				instance.autoWidth = value
			}
		},
		{ immediate: true },
	)

	watch(
		() => props.wordWrap,
		(value) => {
			if (value !== undefined && value !== instance.wordWrap) {
				instance.wordWrap = value
			}
		},
		{ immediate: true },
	)

	watch(
		() => props.scrollBehavior,
		(value) => {
			if (value !== undefined && value !== instance.scrollBehavior) {
				instance.scrollBehavior = value
			}
		},
		{ immediate: true },
	)

	return {
		...syncPropsControl,
		...syncPropsSelectableCollection,
		...useSyncProps(instance.events as any, {}),
	}
}
