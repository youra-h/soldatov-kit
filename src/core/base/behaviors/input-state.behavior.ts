import type { TEvented } from '../../common/evented'
import type { TControlInputState } from '../control-input/types'

type TInputStateHost = { events: TEvented<any> }

export interface IInputStateBehaviorProps {
	readonly: boolean
	required: boolean
	invalid: boolean
	state: TControlInputState
	loading: boolean
}

/**
 * Поведение состояния "ввода" (readonly/required/invalid/state/loading) без собственного emitter.
 *
 * Эмитит через `host.events` события вида `change:<prop>`:
 * - `change:readonly`
 * - `change:required`
 * - `change:invalid`
 * - `change:state`
 * - `change:loading`
 */
export class TInputStateBehavior {
	private _host: TInputStateHost

	private _readonly = false
	private _required = false
	private _invalid = false
	private _state: TControlInputState = 'normal'
	private _loading = false

	constructor(
		host: TInputStateHost,
		initial?: Partial<IInputStateBehaviorProps>,
	) {
		this._host = host
		if (initial) {
			if (initial.readonly !== undefined) this._readonly = initial.readonly
			if (initial.required !== undefined) this._required = initial.required
			if (initial.invalid !== undefined) this._invalid = initial.invalid
			if (initial.state !== undefined) this._state = initial.state
			if (initial.loading !== undefined) this._loading = initial.loading
		}
	}

	get readonly(): boolean {
		return this._readonly
	}
	set readonly(value: boolean) {
		if (this._readonly === value) return
		this._readonly = value
		;(this._host.events as any).emit('change:readonly', value)
	}

	get required(): boolean {
		return this._required
	}
	set required(value: boolean) {
		if (this._required === value) return
		this._required = value
		;(this._host.events as any).emit('change:required', value)
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
		;(this._host.events as any).emit('change:invalid', value)
		;(this._host.events as any).emit('change:state', this._state)
	}

	get state(): TControlInputState {
		return this._state
	}
	set state(value: TControlInputState) {
		if (this._state === value) return
		this._state = value
		;(this._host.events as any).emit('change:state', value)
	}

	get loading(): boolean {
		return this._loading
	}
	set loading(value: boolean) {
		if (this._loading === value) return
		this._loading = value
		;(this._host.events as any).emit('change:loading', value)
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
