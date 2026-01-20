import type { PropType } from 'vue'
import { watch } from 'vue'
import { type ITextable, type ITextableProps, TTextable } from '../../../core'
import { BaseControl, emitsControl, propsControl, syncControl } from '../control'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

export const emitsTextable: TEmits = [
	...emitsControl,
	'change:text',
	'update:text',
	'text',
] as const

export const propsTextable: TProps = {
	...propsControl,
	text: {
		type: String as PropType<ITextableProps['text']>,
		default: TTextable.defaultValues.text,
	},
}

export default {
	name: 'BaseTextable',
	extends: BaseControl,
	emits: emitsTextable,
	props: propsTextable,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncTextable(options: ISyncComponentModelOptions<ITextableProps, ITextable>) {
	syncControl(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('change:text' as any, (value: string) => {
		emit?.('change:text', value)
		emit?.('text', value)
		emit?.('update:text', value)
	})

	watch<string | undefined>(
		() => props.text,
		(value) => {
			if (value !== undefined && value !== instance.text) {
				instance.text = value
			}
		},
	)
}
