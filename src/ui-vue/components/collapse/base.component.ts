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
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsCollapse: TEmits = [
	...emitsControl,
	...emitsSelectableCollection,
	'change:appearance',
	'update:appearance',
	'item:disabled',
	'item:text',
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

export interface ICollapseState extends IControlState, ISelectableCollectionState<ICollapseItem> {
	appearance: Ref<TCollapseAppearance>
}

export function syncCollapse(
	options: ISyncComponentViewOptions<ICollapseProps & ICollectionProps, ICollapse>,
): ICollapseState {
	const syncPropsControl = syncControl(options)

	const { props, instance, emit, plugins } = options

	const syncPropsSelectableCollection = syncSelectableCollection<ICollapseItem>({
		props,
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

	instance.events.on('item:text', (item: ICollapseItem, value: string) => {
		emit?.('item:text', item, value)
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
		...syncPropsControl,
		...syncPropsSelectableCollection,
		...useSyncProps(instance.events as any, {
			appearance: () => instance.appearance,
		}),
	}
}
