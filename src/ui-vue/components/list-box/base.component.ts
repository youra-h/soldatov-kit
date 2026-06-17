import type { PropType } from 'vue'
import { watch } from 'vue'
import {
	type IListBox,
	type IListBoxProps,
	TListBox,
	type TListBoxAppearance,
	type ICollectionProps,
} from '@core'
import { BaseList, emitsList, propsList, syncList, type IListState } from '../list'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../types'

export const emitsListBox: TEmits = [
	...emitsList,
	'change:appearance',
	'update:appearance',
] as const

export const propsListBox: TProps = {
	...propsList,
	appearance: {
		type: String as PropType<TListBoxAppearance>,
		default: TListBox.defaultValues.appearance,
	},
}

export default {
	name: 'BaseListBox',
	extends: BaseList,
	emits: emitsListBox,
	props: propsListBox,
}

export function syncListBox(
	options: ISyncComponentViewOptions<IListBoxProps & ICollectionProps, IListBox>,
): IListState {
	const syncProps = syncList(options)

	const { props, instance, emit } = options

	instance.events.on('change:appearance', (value: TListBoxAppearance) => {
		emit?.('change:appearance', value)
		emit?.('update:appearance', value)
	})

	watch<TListBoxAppearance | undefined>(
		() => props.appearance,
		(value) => {
			if (value !== undefined && value !== instance.appearance) {
				instance.appearance = value
			}
		},
	)

	return syncProps
}
