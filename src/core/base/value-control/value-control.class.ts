import { TControl } from '../control'
import type { IComponentViewOptions } from '../component-view'
import { TComponentView } from '../component-view'
import { resolveState } from '../../common/resolve-state'
import type { IValueControlProps, TValueControlEvents, TValueControlStatesOptions } from './types'
import { TStateUnit, type IStateUnit } from '../state-unit'

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
	TStates extends TValueControlStatesOptions<TValue> = TValueControlStatesOptions<TValue>,
> extends TControl<TProps, TEvents, TStates> {
	static defaultValues: Partial<IValueControlProps<any>> = {
		...TControl.defaultValues,
		name: '',
		value: undefined,
	}

	protected _valueState: IStateUnit<TValue>
	protected _name: string

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		this._name = props.name ?? (TValueControl.defaultValues.name as string)

		const value = props.value ?? (TValueControl.defaultValues.value as TValue)

		this._valueState = resolveState<IStateUnit<TValue>, TValue>(
			states?.value,
			TStateUnit,
			value,
		)

		this._valueState.events.on('change', (value) => {
			this.events.emit('change:value' as any, value)
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

	getProps(): TProps {
		return {
			...super.getProps(),
			name: this._name,
			value: this._valueState.value,
		} as TProps
	}
}
