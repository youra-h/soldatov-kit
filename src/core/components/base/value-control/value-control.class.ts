import { TControl } from '../control'
import type { IComponentViewOptions } from '../component-view'
import { TComponentView } from '../component-view'
import type { IValueControlProps, TValueControlEvents, TValueControlStates } from './types'
import { TStateUnit } from '../../../common'
import type { TValuePayload } from '../../../bridge'
import { TEvented } from '../../../common'

/**
 * База для контролов со значением.
 *
 * Содержит:
 * - `value` (commit) + `input(value)` (optional)
 * - `name` (form semantics)
 *
 * Интерактивность (disabled/focused) и stylable (size/variant) наследуются из `TControl`.
 */
export default class TValueControl<
	TValue,
	TProps extends IValueControlProps<TValue> = IValueControlProps<TValue>,
	TEvents extends TValueControlEvents<TValue> = TValueControlEvents<TValue>,
	TStates extends TValueControlStates<TValue> = TValueControlStates<TValue>,
> extends TControl<TProps, TEvents, TStates> {
	static defaultValues: Partial<IValueControlProps<any>> = {
		...TControl.defaultValues,
		name: '',
		value: undefined,
	}

	protected _name: string

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const ctor = new.target as typeof TValueControl

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		this._name = props.name ?? (ctor.defaultValues.name as string)

		const value = props.value ?? (ctor.defaultValues.value as TValue)

		this._states.value = states?.value ?? new TStateUnit<TValue>({ initial: value })

		this._states.value.events.on('change', (payload: TValuePayload<TValue>) => {
			; (this.events as TEvented<TValueControlEvents<TValue>>).emit('change:value', payload)
				; (this.events as TEvented<TValueControlEvents<TValue>>).emit('input:value', payload)
		})
	}

	get name(): string {
		return this._name
	}
	set name(value: string) {
		if (this._name === value) return

		this._name = value
			; (this.events as TEvented<TValueControlEvents<TValue>>).emit('change:name' as any, value)
	}

	get value(): TValue {
		return this._states.value.value
	}
	set value(value: TValue) {
		this._states.value.value = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			name: this._name,
			value: this._states.value.value,
		} as TProps
	}
}
