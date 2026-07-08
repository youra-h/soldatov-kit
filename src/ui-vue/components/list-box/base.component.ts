import type { PropType } from 'vue'
import { watch } from 'vue'
import {
	type IListBox,
	type IListBoxItem,
	type IListBoxProps,
	TListBox,
	type TListBoxView,
} from '@core'
import { BaseList, emitsList, propsList, syncList, type IListState } from '../list'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsListBox: TEmits = [
	...emitsList,
	'change:view',
	'update:view',
] as const

export const propsListBox: TProps = {
	...useInheritProps(propsList, TListBox),
	view: {
		type: String as PropType<TListBoxView>,
		default: TListBox.defaultValues.view,
	},
}

export default {
	name: 'BaseListBox',
	extends: BaseList,
	emits: emitsListBox,
	props: propsListBox,
}

export function syncListBox(
	options: ISyncComponentOptions<IListBoxProps<IListBoxItem>, IListBox>,
): IListState<IListBoxItem> {
	const syncProps = syncList<IListBoxItem>(options)

	const { props, instance, emit } = options

	instance.events.on('change:view', (value: TListBoxView) => {
		emit?.('change:view', value)
		emit?.('update:view', value)
	})

	watch<TListBoxView | undefined>(
		() => props.view,
		(value) => {
			if (value !== undefined && value !== instance.view) {
				instance.view = value
			}
		},
	)

	return syncProps
}
