import { TObject } from '../object'
import { TEvented } from '../../common/evented'

export type TValueBehaviorEvents<T> = {
	change: (value: T) => void
}

export interface IValueBehaviorProps<T> {
	value: T
}

/**
 * Общее поведение "value".
 *
 * Используется для контролов, где есть внутреннее значение: checkbox, input и т.д.
 */
export class TValueBehavior<T> extends TObject<IValueBehaviorProps<T>> {
	public readonly events: TEvented<TValueBehaviorEvents<T>>
	private _value: T

	constructor(initialValue: T) {
		super()
		this._value = initialValue
		this.events = new TEvented<TValueBehaviorEvents<T>>()
	}

	get value(): T {
		return this._value
	}

	set value(value: T) {
		if (this._value !== value) {
			this._value = value
			this.events.emit('change', value)
		}
	}

	getProps(): IValueBehaviorProps<T> {
		return {
			value: this._value,
		}
	}
}
