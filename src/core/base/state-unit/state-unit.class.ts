import { TEvented } from '../../common/evented'

export type TStateUnitEvents = {
	change: (...args: any[]) => void
}

export type TStateValueEvents<TValue> = {
	change: (value: TValue) => void
}

/**
 * Контракт value-based state.
 * Все state-units имеют `value` и событие `change`.
 */
export interface IStateUnit<
	TValue,
	TEvents extends TStateUnitEvents = TStateUnitEvents,
> {
	value: TValue
	readonly events: TEvented<TEvents>
}

/**
 * Универсальная единица состояния со значением.
 *
 * По умолчанию сеттер `value` эмитит `change(value)`.
 * Если нужно расширить payload события (например change(new, old)) —
 * переопределяйте `emitChange`.
 */
export class TStateUnit<
	TValue,
	TEvents extends TStateUnitEvents = TStateValueEvents<TValue>,
> implements IStateUnit<TValue, TEvents>
{
	public readonly events: TEvented<TEvents>
	protected _value: TValue

	constructor(initial: TValue) {
		this.events = new TEvented<TEvents>()
		this._value = initial
	}

	get value(): TValue {
		return this._value
	}

	set value(next: TValue) {
		if (this._value === next) return
		const prev = this._value
		this._value = next
		this.emitChange(next, prev)
	}

	protected emitChange(next: TValue, _prev: TValue): void {
		this.events.emit('change', next)
	}
}
