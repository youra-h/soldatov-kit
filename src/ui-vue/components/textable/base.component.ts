import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import { type ITextable, type ITextableProps, TTextable } from '@core'
import { BaseControl, emitsControl, propsControl, syncControl, type IControlState } from '../control'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsTextable: TEmits = [
	...emitsControl,
	'change:text',
	'update:text',
] as const

export const propsTextable: TProps = {
	...useInheritProps(propsControl, TTextable),
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

export interface ITextableState extends IControlState {
	text: Ref<string>
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncTextable(options: ISyncComponentOptions<ITextableProps, ITextable>): ITextableState {
	const syncProps = syncControl(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('change:text' as any, (value: string) => {
		emit?.('change:text', value)
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

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			text: () => instance.text,
		}),
	}
}
