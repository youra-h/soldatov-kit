import { TStateUnit, type IStateUnit } from '../state-unit'

export type TControlInputState = 'normal' | 'success' | 'warning' | 'error'

export interface IInputStateProps {
	// Значение недоступно для редактирования
	readonly?: boolean
	// Значение обязательно для заполнения
	required?: boolean
	// Значение не валидно
	invalid?: boolean
	// Состояние контрола
	state?: TControlInputState
	// Показать индикатор загрузки
	loading?: boolean
}

export interface IInputState extends IStateUnit<IInputStateProps>, IInputStateProps {}

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
export class TInputState extends TStateUnit<IInputStateProps> implements IInputState {
	private _readonly = false
	private _required = false
	private _invalid = false
	private _state: TControlInputState = 'normal'
	private _loading = false

	constructor(initial: Partial<IInputStateProps> = {}) {
		const value: IInputStateProps = {
			readonly: initial.readonly ?? false,
			required: initial.required ?? false,
			invalid: initial.invalid ?? false,
			state: initial.state ?? 'normal',
			loading: initial.loading ?? false,
		}

		if (value.invalid) value.state = 'error'

		super(value)
	}

	get readonly(): boolean {
		return this._readonly
	}
	set readonly(value: boolean) {
		if (this._readonly === value) return

		this._readonly = value

		this.events.emit('change', { readonly: value })
	}

	get required(): boolean {
		return this._required
	}
	set required(value: boolean) {
		if (this._required === value) return

		this._required = value

		this.events.emit('change', { required: value })
	}

	get invalid(): boolean {
		return this._invalid
	}
	set invalid(value: boolean) {
		if (this._invalid === value) return

		this._invalid = value

		if (value) {
			this._state = 'error'
		}

		this.events.emit('change', { invalid: value, state: this._state })
	}

	get state(): TControlInputState {
		return this._state
	}
	set state(value: TControlInputState) {
		if (this._state === value) return

		this._state = value

		this.events.emit('change', { state: value })
	}

	get loading(): boolean {
		return this._loading
	}
	set loading(value: boolean) {
		if (this._loading === value) return

		this._loading = value

		this.events.emit('change', { loading: value })
	}
}
