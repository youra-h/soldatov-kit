import { TStateUnit, type IStateUnit } from '../state-unit'
import type { TStateCtor } from './types'

/**
 * Конфигурация поведения при loading
 */
export interface ILoadingBehavior {
	/** Должен ли компонент становиться disabled при loading */
	shouldDisable?: boolean
}

/**
 * Значение состояния loading
 */
export interface ILoadingStateValue {
	loading: boolean
}

export interface ILoadingState extends IStateUnit<ILoadingStateValue> {
	loading: boolean
	behavior: ILoadingBehavior

	startLoading(): void
	stopLoading(): void
}

export type TLoadingStateCtor = TStateCtor<ILoadingState, boolean | ILoadingBehavior>

/**
 * Единица состояния "loading" с настраиваемым поведением.
 *
 * Зачем нужна:
 * - инкапсулирует логику состояния загрузки
 * - позволяет композировать поведение через DI (disabled при loading)
 * - эмитит событие `change` с полным состоянием
 *
 * Примеры использования:
 *
 * 1. Простой флаг без поведения:
 *    ```ts
 *    new TLoadingState(false)
 *    ```
 *
 * 2. С автоматическим disabled при loading:
 *    ```ts
 *    new TLoadingState({ shouldDisable: true })
 *    ```
 *
 * 3. Кастомная логика через наследование:
 *    ```ts
 *    class CustomLoadingState extends TLoadingState {
 *      startLoading() {
 *        super.startLoading()
 *        // дополнительная логика
 *      }
 *    }
 *    ```
 */
export class TLoadingState extends TStateUnit<ILoadingStateValue> implements ILoadingState {
	public behavior: ILoadingBehavior

	constructor(initial: boolean | ILoadingBehavior = false) {
		const isBoolean = typeof initial === 'boolean'

		const behavior: ILoadingBehavior = isBoolean
			? {}
			: {
					shouldDisable: initial.shouldDisable,
				}

		const value: ILoadingStateValue = {
			loading: isBoolean ? initial : false,
		}

		super(value)
		this.behavior = behavior
	}

	get loading(): boolean {
		return this._value.loading
	}

	set loading(value: boolean) {
		if (this._value.loading === value) return

		if (value) {
			this.startLoading()
		} else {
			this.stopLoading()
		}
	}

	startLoading(): void {
		if (this._value.loading) return

		this._value.loading = true
		this.events.emit('change', { ...this._value })
	}

	stopLoading(): void {
		if (!this._value.loading) return

		this._value.loading = false
		this.events.emit('change', { ...this._value })
	}
}
