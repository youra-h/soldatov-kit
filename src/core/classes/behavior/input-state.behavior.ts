import { TObject } from '../object'
import { TEvented } from '../../common/evented'
import type { TControlInputState } from '../control-input/types'

export type TInputStateBehaviorEvents = {
	change: () => void
}

export interface IInputStateBehaviorProps {
	readonly: boolean
	required: boolean
	invalid: boolean
	state: TControlInputState
	loading: boolean
}

/**
 * Поведение состояния "ввода" (readonly/required/invalid/state/loading).
 *
 * Это веб-специфичные атрибуты/состояния формы, которые часто нужны разным
 * инпутам и переключателям.
 */
export class TInputStateBehavior extends TObject<IInputStateBehaviorProps> {
	public readonly events = new TEvented<TInputStateBehaviorEvents>()

	private _readonly = false
	private _required = false
	private _invalid = false
	private _state: TControlInputState = 'normal'
	private _loading = false

	get readonly(): boolean {
		return this._readonly
	}
	set readonly(value: boolean) {
		if (this._readonly !== value) {
			this._readonly = value
			this.events.emit('change')
		}
	}

	get required(): boolean {
		return this._required
	}
	set required(value: boolean) {
		if (this._required !== value) {
			this._required = value
			this.events.emit('change')
		}
	}

	get invalid(): boolean {
		return this._invalid
	}
	set invalid(value: boolean) {
		if (this._invalid !== value) {
			this._invalid = value
			if (value) {
				this._state = 'error'
			}
			this.events.emit('change')
		}
	}

	get state(): TControlInputState {
		return this._state
	}
	set state(value: TControlInputState) {
		if (this._state !== value) {
			this._state = value
			this.events.emit('change')
		}
	}

	get loading(): boolean {
		return this._loading
	}
	set loading(value: boolean) {
		if (this._loading !== value) {
			this._loading = value
			this.events.emit('change')
		}
	}

	getProps(): IInputStateBehaviorProps {
		return {
			readonly: this._readonly,
			required: this._required,
			invalid: this._invalid,
			state: this._state,
			loading: this._loading,
		}
	}
}
