import { TEntity } from '../entity'
import { TEvented } from '../../common/evented'

export type TDisableableBehaviorEvents = {
	change: (value: boolean) => void
}

export interface IDisableableBehaviorProps {
	disabled: boolean
}

/**
 * Поведение "disabled".
 *
 * Используется для композиции: компонент хранит экземпляр поведения и
 * проксирует геттер/сеттер `disabled` наружу.
 */
export class TDisableableBehavior extends TEntity<IDisableableBehaviorProps> {
	public readonly events = new TEvented<TDisableableBehaviorEvents>()
	private _disabled = false

	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled !== value) {
			this._disabled = value
			this.events.emit('change', value)
		}
	}

	getProps(): IDisableableBehaviorProps {
		return {
			disabled: this._disabled,
		}
	}
}
