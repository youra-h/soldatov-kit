import { TStateUnit, type IStateUnit } from '../state-unit'
import type { TStateCtor } from './types'

/**
 * Конфигурация поведения при loading
 */
export interface ILoadingBehavior<TSpinner = any> {
	/** Должен ли компонент становиться disabled при loading */
	shouldDisable?: boolean
	/** Фабрика для создания spinner (если нужен) */
	createSpinner?: () => TSpinner
}

/**
 * Значение состояния loading
 */
export interface ILoadingStateValue<TSpinner = any> {
	loading: boolean
	/** Опциональный spinner, создается при loading = true если задан createSpinner */
	spinner?: TSpinner
}

export interface ILoadingState<TSpinner = any> extends IStateUnit<ILoadingStateValue<TSpinner>> {
	loading: boolean
	spinner?: TSpinner
	behavior: ILoadingBehavior<TSpinner>

	startLoading(): void
	stopLoading(): void
}

export type TLoadingStateCtor<TSpinner = any> = TStateCtor<
	ILoadingState<TSpinner>,
	boolean | ILoadingBehavior<TSpinner>
>

/**
 * Единица состояния "loading" с настраиваемым поведением.
 *
 * Зачем нужна:
 * - инкапсулирует логику состояния загрузки
 * - позволяет композировать поведение через DI (создание spinner, disabled при loading)
 * - эмитит событие `change` с полным состоянием
 *
 * Примеры использования:
 *
 * 1. Простой флаг без поведения:
 *    ```ts
 *    new TLoadingState(false)
 *    ```
 *
 * 2. С автоматическим созданием spinner:
 *    ```ts
 *    new TLoadingState({
 *      shouldDisable: true,
 *      createSpinner: () => new TSpinner({ size: 'small' })
 *    })
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
export class TLoadingState<TSpinner = any>
	extends TStateUnit<ILoadingStateValue<TSpinner>>
	implements ILoadingState<TSpinner>
{
	public behavior: ILoadingBehavior<TSpinner>

	constructor(initial: boolean | ILoadingBehavior<TSpinner> = false) {
		const isBoolean = typeof initial === 'boolean'

		const behavior: ILoadingBehavior<TSpinner> = isBoolean
			? {}
			: {
					shouldDisable: initial.shouldDisable,
					createSpinner: initial.createSpinner,
				}

		const value: ILoadingStateValue<TSpinner> = {
			loading: isBoolean ? initial : false,
			spinner: undefined,
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

	get spinner(): TSpinner | undefined {
		return this._value.spinner
	}

	startLoading(): void {
		if (this._value.loading) return

		this._value.loading = true

		// Создаем spinner если задана фабрика
		if (this.behavior.createSpinner && !this._value.spinner) {
			this._value.spinner = this.behavior.createSpinner()
		}

		this.events.emit('change', { ...this._value })
	}

	stopLoading(): void {
		if (!this._value.loading) return

		this._value.loading = false
		// Spinner остается доступен, но не показывается

		this.events.emit('change', { ...this._value })
	}
}
