import { TTextable } from '../../base/textable'
import type {
	IButton,
	IButtonProps,
	TButtonAppearance,
	TButtonEvents,
	TButtonStatesOptions,
} from './types'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import { TLoadingState, type ILoadingState, type ILoadingStateValue } from '../../common/states'
import { resolveState } from '../../common/resolve-state'
import { type TValuePayload } from '../../common/types'

export default class TButton extends TTextable<IButtonProps, TButtonEvents> implements IButton {
	static override baseClass = 's-button'

	static defaultValues: Partial<IButtonProps> = {
		...TTextable.defaultValues,
		variant: 'normal',
		appearance: 'filled',
		tag: 'button',
		loading: false,
	}

	protected _appearance: TButtonAppearance
	protected _loadingState: ILoadingState
	/**
	 * Флаг отслеживания источника disabled состояния.
	 * true = disabled был установлен автоматически через loading.
	 * false = disabled был установлен вручную или изначально.
	 */
	protected _disabledByLoading = false

	constructor(
		options:
			| IComponentViewOptions<IButtonProps, TButtonStatesOptions>
			| Partial<IButtonProps> = {},
	) {
		super(options)

		const { props = {}, states } = TComponentView.prepareOptions<
			IButtonProps,
			TButtonStatesOptions
		>(options)

		this._tag = props.tag ?? TButton.defaultValues.tag!

		this._appearance = props.appearance ?? TButton.defaultValues.appearance!

		// Создаем loading state с shouldDisable: true для кнопки
		const loadingInitial = states?.loading
			? undefined
			: {
					shouldDisable: true, // Кнопка становится disabled при loading
				}

		this._loadingState = resolveState<ILoadingState, boolean | any>({
			state: states?.loading,
			ctor: TLoadingState,
			initial: loadingInitial,
		})

		// Устанавливаем начальное значение loading из props
		if (props.loading !== undefined) {
			this._loadingState.loading = props.loading
		}

		// При изменении loading умно управляем disabled с учетом источника
		this._loadingState.events.on('change', (payload: TValuePayload<ILoadingStateValue>) => {
			if (this._loadingState.behavior.shouldDisable) {
				if (payload.newValue.loading) {
					// Loading активируется - устанавливаем disabled только если он не был установлен вручную
					if (!this._disableable.value || this._disabledByLoading) {
						this._disableable.value = true
						this._disabledByLoading = true
					}
					// Если disabled уже true вручную, не трогаем его и не помечаем как _disabledByLoading
				} else {
					// Loading деактивируется - снимаем disabled только если он был установлен loading'ом
					if (this._disabledByLoading) {
						this._disableable.value = false
						this._disabledByLoading = false
					}
				}
			}
			this.events.emit('change:loading', payload.newValue.loading)
		})
	}

	get appearance(): TButtonAppearance {
		return this._appearance
	}

	set appearance(newValue: TButtonAppearance) {
		if (newValue && this._appearance !== newValue) {
			const oldValue = this._appearance

			this._appearance = newValue

			this._classes.swapClass({
				oldClass: `--a-${oldValue}`,
				newClass: `--a-${newValue}`,
			})
		}
	}

	get loadingState(): ILoadingState {
		return this._loadingState
	}

	get loading(): boolean {
		return this._loadingState.loading
	}

	set loading(value: boolean) {
		this._loadingState.loading = value
	}

	// Переопределяем disabled для отслеживания ручной установки
	override get disabled(): boolean {
		return this._disableable.value
	}

	override set disabled(value: boolean) {
		// При ручной установке disabled = false сбрасываем флаг _disabledByLoading
		if (this._disabledByLoading && !value) {
			this._disabledByLoading = false
		}
		this._disableable.value = value
	}

	getProps(): IButtonProps {
		return {
			...super.getProps(),
			appearance: this._appearance,
			loading: this.loading,
		}
	}
}
