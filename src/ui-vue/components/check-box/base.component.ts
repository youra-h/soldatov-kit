import { type PropType, watch, type Ref } from 'vue'
import { type ICheckBoxProps, type ICheckBox, TCheckBox } from '@core'
import {
	BaseInputControl,
	emitsInputControl,
	propsInputControl,
	syncInputControl,
	type IInputControlState,
} from '../input-control'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types/common'
import { Icon } from '../icon'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsCheckBox: TEmits = [
	...emitsInputControl,
	'update:indeterminate',
	'indeterminate',
	'change:indeterminate',
	'update:plain',
	'plain',
	'change:plain',
] as const

export const propsCheckBox: TProps = {
	...propsInputControl,
	value: {
		type: [Boolean, Number] as PropType<ICheckBoxProps['value']>,
		default: TCheckBox.defaultValues.value,
	},
	indeterminate: {
		type: Boolean as PropType<ICheckBoxProps['indeterminate']>,
		default: TCheckBox.defaultValues.indeterminate,
	},
	plain: {
		type: Boolean as PropType<ICheckBoxProps['plain']>,
		default: TCheckBox.defaultValues.plain,
	},
}

export default {
	name: 'BaseCheckBox',
	extends: BaseInputControl,
	components: { Icon },
	emits: emitsCheckBox,
	props: propsCheckBox,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export interface ICheckBoxState extends IInputControlState<boolean | undefined> {
	indeterminate: Ref<boolean>
	plain: Ref<boolean>
}

export function syncCheckBox(
	options: ISyncComponentModelOptions<ICheckBoxProps, ICheckBox>,
): ICheckBoxState {
	const syncProps = syncInputControl(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('change:indeterminate' as any, (value: boolean) => {
		emit?.('change:indeterminate', value)
		emit?.('indeterminate', value)
		emit?.('update:indeterminate', value)
	})

	instance.events.on('change:plain' as any, (value: boolean) => {
		emit?.('change:plain', value)
		emit?.('plain', value)
		emit?.('update:plain', value)
	})

	watch<boolean | undefined>(
		() => props.indeterminate,
		(value) => {
			if (value !== undefined && value !== instance.indeterminate) {
				instance.indeterminate = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.plain,
		(value) => {
			if (value !== undefined && value !== instance.plain) {
				instance.plain = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			indeterminate: () => instance.indeterminate,
			plain: () => instance.plain,
		}),
	}
}
