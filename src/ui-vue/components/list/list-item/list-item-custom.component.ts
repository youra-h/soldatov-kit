import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import {
	type IListItemCustom,
	type IListItemCustomProps,
	TListItemCustom,
	type TValuePayload,
} from '@core'
import {
	BaseValueControl,
	emitsValueControl,
	propsValueControl,
	syncValueControl,
	type IValueControlState,
} from '../../value-control'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../../types'
import { useSyncProps } from '../../../composables/useSyncProps'

export const emitsListItemCustom: TEmits = [
	...emitsValueControl,
	'change:text',
	'update:text',
] as const

export const propsListItemCustom: TProps = {
	...propsValueControl,
	tag: {
		type: [Object, String] as PropType<IListItemCustomProps['tag']>,
		default: TListItemCustom.defaultValues.tag,
	},
	text: {
		type: String as PropType<IListItemCustomProps['text']>,
		default: TListItemCustom.defaultValues.text,
	},
}

export default {
	name: 'BaseListItemCustom',
	extends: BaseValueControl,
	emits: emitsListItemCustom,
	props: propsListItemCustom,
}

export interface IListItemCustomState extends IValueControlState {
	text: Ref<string>
}

export function syncListItemCustom(
	options: ISyncComponentViewOptions<IListItemCustomProps, IListItemCustom>,
): IListItemCustomState {
	const syncProps = syncValueControl(options)

	const { props, instance, emit } = options

	instance.events.on('change:text', (payload: TValuePayload<string>) => {
		emit?.('change:text', payload)
		emit?.('update:text', payload.newValue)
	})

	watch<string | undefined>(
		() => props.text,
		(value) => {
			if (value !== undefined && value !== instance.text) {
				instance.text = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			text: () => instance.text,
		}),
	}
}
