import type { PropType } from 'vue'
import { watch } from 'vue'
import {
	type ITabItemCustom,
	type ITabItemCustomProps,
	TTabItemCustom,
} from '../../../../core'
import { BaseValueControl, emitsValueControl, propsValueControl, syncValueControl } from '../../value-control'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'

export const emitsTabItemCustom: TEmits = [
	...emitsValueControl,
	'change:text',
	'update:text',
	'change:closable',
	'update:closable',
	'close',
] as const

export const propsTabItemCustom: TProps = {
	...propsValueControl,
	text: {
		type: String as PropType<ITabItemCustomProps['text']>,
		default: TTabItemCustom.defaultValues.text,
	},
	closable: {
		type: Boolean as PropType<ITabItemCustomProps['closable']>,
		default: TTabItemCustom.defaultValues.closable,
	},
}

export default {
	name: 'BaseTabItemCustom',
	extends: BaseValueControl,
	emits: emitsTabItemCustom,
	props: propsTabItemCustom,
}

/**
 * Синхронизация props и событий для TabItemCustom
 */
export function syncTabItemCustom(
	options: ISyncComponentModelOptions<ITabItemCustomProps, ITabItemCustom>,
) {
	syncValueControl(options)

	const { props, instance, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('change:text', (value: string) => {
		emit?.('change:text', value)
		emit?.('update:text', value)
	})

	instance.events.on('change:closable', (value: boolean | undefined) => {
		emit?.('change:closable', value)
		emit?.('update:closable', value)
	})

	instance.events.on('close', () => {
		emit?.('close')
	})

	watch<string | undefined>(
		() => props.text,
		(value) => {
			if (value !== undefined && value !== instance.text) {
				instance.text = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.closable,
		(value) => {
			if (value !== undefined && value !== instance.closable) {
				instance.closable = value
			}
		},
	)
}
