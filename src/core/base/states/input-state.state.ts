import { TStateUnit, type IStateUnit, type TStateUnitValueEvents } from '../state-unit'
import type { TStateCtor } from './types'

export type TControlInputState = 'normal' | 'success' | 'warning' | 'error'

type TInputStateEvents = TStateUnitValueEvents<IInputStateProps, [Partial<IInputStateProps>]>

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

export type IInputState = IStateUnit<IInputStateProps, TInputStateEvents> & IInputStateProps

export type TInputStateCtor = TStateCtor<IInputState, Partial<IInputStateProps>>

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
export class TInputState
	extends TStateUnit<IInputStateProps, TInputStateEvents>
	implements IInputState
{
	constructor(initial?: Partial<IInputStateProps>) {
		const snapshot: IInputStateProps = {
			readonly: initial?.readonly ?? false,
			required: initial?.required ?? false,
			invalid: initial?.invalid ?? false,
			state: initial?.state ?? 'normal',
			loading: initial?.loading ?? false,
		}

		if (snapshot.invalid) {
			snapshot.state = 'error'
		}

		super(snapshot)
	}

	protected emitChange(next: IInputStateProps, prev: IInputStateProps): void {
		const patch: Partial<IInputStateProps> = {}

		if (next.readonly !== prev.readonly) patch.readonly = next.readonly
		if (next.required !== prev.required) patch.required = next.required
		if (next.invalid !== prev.invalid) patch.invalid = next.invalid
		if (next.state !== prev.state) patch.state = next.state
		if (next.loading !== prev.loading) patch.loading = next.loading

		this.events.emit('change', patch)
	}

	private applyPatch(patch: Partial<IInputStateProps>): void {
		const next: IInputStateProps = {
			...this.value,
			...patch,
		}

		if (next.invalid) {
			next.state = 'error'
		}

		this.value = next
	}

	get readonly(): boolean {
		return this.value.readonly ?? false
	}
	set readonly(value: boolean) {
		if ((this.value.readonly ?? false) === value) return
		this.applyPatch({ readonly: value })
	}

	get required(): boolean {
		return this.value.required ?? false
	}
	set required(value: boolean) {
		if ((this.value.required ?? false) === value) return
		this.applyPatch({ required: value })
	}

	get invalid(): boolean {
		return this.value.invalid ?? false
	}
	set invalid(value: boolean) {
		if ((this.value.invalid ?? false) === value) return
		this.applyPatch({ invalid: value })
	}

	get state(): TControlInputState {
		return (this.value.state ?? 'normal') as TControlInputState
	}
	set state(value: TControlInputState) {
		if (this.invalid) return
		if (this.state === value) return
		this.applyPatch({ state: value })
	}

	get loading(): boolean {
		return this.value.loading ?? false
	}
	set loading(value: boolean) {
		if ((this.value.loading ?? false) === value) return
		this.applyPatch({ loading: value })
	}
}
