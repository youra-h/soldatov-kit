import { TEvented } from '../../common/evented'
import type { TStateUnitEvents, TStateUnitValueEvents, IStateUnit } from './types'

/**
 * Универсальная единица состояния со значением.
 *
 * По умолчанию сеттер `value` эмитит `change(value)`.
 * Если нужно расширить payload события (например change(new, old)) —
 * переопределяйте `emitChange`.
 */
export class TStateUnit<
	TValue,
	TEvents extends TStateUnitEvents = TStateUnitValueEvents<TValue>,
> implements IStateUnit<TValue, TEvents> {
	public readonly events: TEvented<TEvents>
	protected _value: TValue

	constructor(initial: TValue) {
		this.events = new TEvented<TEvents>()
		this._value = initial
	}

	get value(): TValue {
		return this._value
	}

	set value(value: TValue) {
		if (this._value === value) return

		const prev = this._value
		this._value = value

		this.emitChange(value, prev)
	}

	protected emitChange(next: TValue, prev: TValue): void {
		// По умолчанию: change(next)
		// Для расширенных сценариев (change(patch), change(next, prev)) переопределяйте emitChange.
		;(this.events as any).emit('change', next)
	}
}
