import { TStateUnit, type IStateUnit } from '../state-unit'

export type TControlInputState = 'normal' | 'success' | 'warning' | 'error'

// Единственный тип - для значения состояния (все поля обязательные)
export interface IInputStateValue {
	readonly: boolean
	required: boolean
	invalid: boolean
	state: TControlInputState
}

// Публичный интерфейс
export interface IInputState extends IStateUnit<IInputStateValue> {
	readonly: boolean
	required: boolean
	invalid: boolean
	state: TControlInputState
}

/**
 * Единица состояния для атрибутов/состояний ввода.
 *
 * Зачем нужна:
 * - держит "формовые" флаги (`readonly`, `required`, `invalid`) и UI-состояние (`state`, `loading`)
 * - эмитит единое событие `change` с патчем, чтобы компонент-агрегат мог легко синхронизироваться
 *
 * Инварианты:
 * - при `invalid = true` состояние `state` принудительно становится `'error'`.
 */
export class TInputState extends TStateUnit<IInputStateValue> implements IInputState {
	constructor(initial: Partial<IInputStateValue> = {}) {
		const value: IInputStateValue = {
			readonly: initial.readonly ?? false,
			required: initial.required ?? false,
			invalid: initial.invalid ?? false,
			state: initial.state ?? 'normal',
		}

		if (value.invalid) value.state = 'error'

		super(value)
	}

	get readonly(): boolean {
		return this._value.readonly
	}
	set readonly(value: boolean) {
		if (this._value.readonly === value) return

		this._value.readonly = value

		this.events.emit('change', { readonly: value })
	}

	get required(): boolean {
		return this._value.required
	}
	set required(value: boolean) {
		if (this._value.required === value) return

		this._value.required = value

		this.events.emit('change', { required: value })
	}

	get invalid(): boolean {
		return this._value.invalid
	}
	set invalid(value: boolean) {
		if (this._value.invalid === value) return

		const newState = value ? 'error' : this._value.state

		this._value.invalid = value
		this._value.state = newState

		this.events.emit('change', { invalid: value, state: newState })
	}

	get state(): TControlInputState {
		return this._value.state
	}
	set state(value: TControlInputState) {
		if (this._value.state === value) return

		this._value.state = value

		this.events.emit('change', { state: value })
	}
}
