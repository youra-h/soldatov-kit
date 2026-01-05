import { TEvented } from '../../common/evented'
import { TValueState } from '../states/value.state'
import TInteractive from '../interactive/interactive.class'
import type { IValueControlProps, TValueControlEvents } from './types'

/**
 * База для контролов со значением.
 *
 * Содержит:
 * - `value` (commit) + `input(value)` (optional)
 * - `name` (form semantics)
 *
 * Интерактивность (disabled/focused) наследуется из `TInteractive`.
 */
export default class TValueControl<
		T,
		TProps extends IValueControlProps<T> = IValueControlProps<T>,
		TEvents extends TValueControlEvents<T> = TValueControlEvents<T>,
	>
	extends TInteractive<TProps, TEvents>
{
	static defaultValues: Partial<IValueControlProps<any>> = {
		...TInteractive.defaultValues,
		name: '',
		value: null,
	}

	protected _valueState: TValueState<T>
	protected _name: string

	constructor(options: any = {}) {
		super(options)
		const { props = {} } = options

		this._name = props.name ?? (TValueControl.defaultValues.name as string)

		this._valueState = new TValueState<T>(props.value as T)

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

	get value(): T {
		return this._valueState.value
	}
	set value(value: T) {
		this._valueState.value = value
	}

	input(value: T): void {
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
