import { TValueState } from '../states'
import { TControl } from '../control'
import type { IPresentableOptions } from '../presentable'
import { TPresentable } from '../presentable'
import type { IValueControlProps, TValueControlEvents } from './types'

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
> extends TControl<TProps, TEvents> {
	static defaultValues: Partial<IValueControlProps<any>> = {
		...TControl.defaultValues,
		name: '',
		value: null,
	}

	protected _valueState: TValueState<TValue>
	protected _name: string

	constructor(options: IPresentableOptions<TProps> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps> } = TPresentable.prepareOptions<TProps>(
			options as any,
		)

		this._name = props.name ?? (TValueControl.defaultValues.name as string)

		this._valueState = new TValueState<TValue>(props.value as TValue)

		this._valueState.events.on('change', (value) => {
			this.events.emit('change:value' as any, value)
		})

		this._valueState.events.on('input', (value) => {
			this.events.emit('input:value' as any, value)
		})
	}

	get name(): string {
		return this._name
	}
	set name(value: string) {
		if (this._name === value) return

		this._name = value

		this.events.emit('change:name' as any, value)
	}

	get value(): TValue {
		return this._valueState.value
	}
	set value(value: TValue) {
		this._valueState.value = value
	}

	input(value: TValue): void {
		this._valueState.input(value)
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			name: this._name,
			value: this._valueState.value,
		} as TProps
	}
}
