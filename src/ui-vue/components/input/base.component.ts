import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import { type IInputProps, type IInput, TInput } from '@core'
import {
	BaseInputControl,
	emitsInputControl,
	propsInputControl,
	syncInputControl,
	type IInputControlState,
} from '../input-control'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../types/common'
import { useSyncProps } from '../../composables/useSyncProps'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsInput: TEmits = [
	...emitsInputControl,
	'update:placeholder',
	'change:placeholder',
] as const

export const propsInput: TProps = {
	...useInheritProps(propsInputControl, TInput),
	placeholder: {
		type: String as PropType<IInputProps['placeholder']>,
		default: TInput.defaultValues.placeholder,
	},
}

export default {
	name: 'BaseInput',
	extends: BaseInputControl,
	emits: emitsInput,
	props: propsInput,
}

export interface IInputState extends IInputControlState<string> {
	placeholder: Ref<string>
}

export function syncInput(options: ISyncComponentViewOptions<IInputProps, IInput>): IInputState {
	const syncProps = syncInputControl(options)

	const { instance, props, emit } = options

	instance.events.on('change:placeholder' as any, (value: string) => {
		emit?.('change:placeholder', value)
		emit?.('update:placeholder', value)
	})

	watch<string | undefined>(
		() => props.placeholder,
		(value) => {
			if (value !== undefined && value !== instance.placeholder) {
				instance.placeholder = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			placeholder: () => instance.placeholder,
		}),
	}
}
