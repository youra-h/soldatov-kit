import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import { useSyncProps } from '../../composables/useSyncProps'
import {
	type ITabs,
	type ITabsProps,
	TTabs,
	type TTabsOrientation,
	type TTabsAlignment,
	type TTabsPosition,
	type TTabsView,
	type ITabItem,
} from '@core'
import {
	BaseControl,
	emitsControl,
	propsControl,
	syncControl,
	type IControlState,
} from '../control'
import {
	emitsActivatableCollection,
	syncActivatableCollection,
	propsActivatableCollection,
	type IActivatableCollectionState,
} from '../collection/activable'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsTabs: TEmits = [
	...emitsControl,
	...emitsActivatableCollection,
	'change:orientation',
	'update:orientation',
	'change:alignment',
	'update:alignment',
	'change:position',
	'update:position',
	'change:view',
	'update:view',
	'change:closable',
	'update:closable',
	'item:close',
	'item:closable',
	'item:disabled',
	'item:text',
	'item:rendered',
	'item:visible',
	'item:present',
] as const

export const propsTabs: TProps = {
	...useInheritProps(propsControl, TTabs),
	...propsActivatableCollection,
	orientation: {
		type: String as PropType<TTabsOrientation>,
		default: TTabs.defaultValues.orientation,
	},
	alignment: {
		type: String as PropType<TTabsAlignment>,
		default: TTabs.defaultValues.alignment,
	},
	position: {
		type: String as PropType<TTabsPosition>,
		default: TTabs.defaultValues.position,
	},
	view: {
		type: String as PropType<TTabsView>,
		default: TTabs.defaultValues.view,
	},
	closable: {
		type: Boolean as PropType<ITabsProps['closable']>,
		default: TTabs.defaultValues.closable,
	},
}

export default {
	name: 'BaseTabs',
	extends: BaseControl,
	emits: emitsTabs,
	props: propsTabs,
}

export interface ITabsState extends IControlState, IActivatableCollectionState<ITabItem> {
	orientation: Ref<TTabsOrientation>
	alignment: Ref<TTabsAlignment>
	position: Ref<TTabsPosition>
	view: Ref<TTabsView>
	closable: Ref<boolean>
}

/**
 * Синхронизация props и событий для Tabs
 */
export function syncTabs(
	options: ISyncComponentOptions<ITabsProps<ITabItem>, ITabs>,
): ITabsState {
	const synPropsControl = syncControl(options)

	const { props, instance, emit, plugins } = options

	// Синхронизируем коллекцию (items, count, activeItem)
	const synPropsActivatableCollection = syncActivatableCollection<ITabItem>({
		props,
		instance: instance.collection,
		emit,
		plugins,
	})

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('change:orientation', (value: TTabsOrientation) => {
		emit?.('change:orientation', value)
		emit?.('update:orientation', value)
	})

	instance.events.on('change:alignment', (value: TTabsAlignment) => {
		emit?.('change:alignment', value)
		emit?.('update:alignment', value)
	})

	instance.events.on('change:position', (value: TTabsPosition) => {
		emit?.('change:position', value)
		emit?.('update:position', value)
	})

	instance.events.on('change:view', (value: TTabsView) => {
		emit?.('change:view', value)
		emit?.('update:view', value)
	})

	instance.events.on('change:closable', (value: boolean) => {
		emit?.('change:closable', value)
		emit?.('update:closable', value)
	})

	instance.events.on('item:close', (item: ITabItem) => {
		emit?.('item:close', item)
	})

	instance.events.on('item:closable', (item: ITabItem, value: boolean) => {
		emit?.('item:closable', item, value)
	})

	instance.events.on('item:disabled', (item: ITabItem, value: boolean) => {
		emit?.('item:disabled', item, value)
	})

	instance.events.on('item:text', (item: ITabItem, value: string) => {
		emit?.('item:text', item, value)
	})

	instance.events.on('item:rendered', (item: ITabItem, value: boolean) => {
		emit?.('item:rendered', item, value)
	})

	instance.events.on('item:visible', (item: ITabItem, value: boolean) => {
		emit?.('item:visible', item, value)
	})

	instance.events.on('item:present', (item: ITabItem, value: boolean) => {
		emit?.('item:present', item, value)
	})

	// Watch props
	watch<TTabsOrientation | undefined>(
		() => props.orientation,
		(value) => {
			if (value !== undefined && value !== instance.orientation) {
				instance.orientation = value
			}
		},
	)

	watch<TTabsAlignment | undefined>(
		() => props.alignment,
		(value) => {
			if (value !== undefined && value !== instance.alignment) {
				instance.alignment = value
			}
		},
	)

	watch<TTabsPosition | undefined>(
		() => props.position,
		(value) => {
			if (value !== undefined && value !== instance.position) {
				instance.position = value
			}
		},
	)

	watch<TTabsView | undefined>(
		() => props.view,
		(value) => {
			if (value !== undefined && value !== instance.view) {
				instance.view = value
			}
		},
	)

	watch(
		() => props.closable,
		(value) => {
			if (value !== instance.closable) {
				instance.closable = !!value
			}
		},
	)

	// Возвращаем объединённое состояние (control + collection + локальные props)
	return {
		...synPropsControl,
		...synPropsActivatableCollection,
		...useSyncProps(instance.events as any, {
			orientation: () => instance.orientation,
			alignment: () => instance.alignment,
			position: () => instance.position,
			view: () => instance.view,
			closable: () => instance.closable,
		}),
	}
}
