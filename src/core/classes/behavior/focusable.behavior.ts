import { TEntity } from '../entity'
import { TEvented } from '../../common/evented'

export type TFocusableBehaviorEvents = {
	change: (value: boolean) => void
}

export interface IFocusableBehaviorProps {
	focused: boolean
}

/**
 * Поведение фокуса.
 *
 * На вебе фокус часто привязан к DOM, но состояние может быть полезно хранить
 * и на уровне модели (например, для headless-компонентов и тестирования).
 */
export class TFocusableBehavior extends TEntity<IFocusableBehaviorProps> {
	public readonly events = new TEvented<TFocusableBehaviorEvents>()
	private _focused = false

	get focused(): boolean {
		return this._focused
	}

	set focused(value: boolean) {
		if (this._focused !== value) {
			this._focused = value
			this.events.emit('change', value)
		}
	}

	getProps(): IFocusableBehaviorProps {
		return {
			focused: this._focused,
		}
	}
}
