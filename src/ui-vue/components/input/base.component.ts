import { type IInputProps, type IInput, TInput } from '@core'
import {
	BaseInputControl,
	emitsInputControl,
	propsInputControl,
	syncInputControl,
	type IInputControlState,
} from '../input-control'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../types/common'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsInput: TEmits = [
	...emitsInputControl,
] as const

export const propsInput: TProps = {
	...useInheritProps(propsInputControl, TInput),
}

export default {
	name: 'BaseInput',
	extends: BaseInputControl,
	emits: emitsInput,
	props: propsInput,
}

export interface IInputState extends IInputControlState<string> { }

export function syncInput(options: ISyncComponentViewOptions<IInputProps, IInput>): IInputState {
	const syncProps = syncInputControl(options)

	return {
		...syncProps,
	}
}
