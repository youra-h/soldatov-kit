import { TTextable } from '../../base/textable'
import type {
	IButton,
	IButtonProps,
	TButtonAppearance,
	TButtonEvents,
	TButtonStatesOptions,
} from './types'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import { TLoadingState, type ILoadingState } from '../../base/states'
import { resolveState } from '../../common/resolve-state'

export default class TButton extends TTextable<IButtonProps, TButtonEvents> implements IButton {
	static override baseClass = 's-button'

	static defaultValues: Partial<IButtonProps> = {
		...TTextable.defaultValues,
		variant: 'normal',
		appearance: 'normal',
		tag: 'button',
		loading: false,
	}

	protected _appearance: TButtonAppearance
	protected _loadingState: ILoadingState

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

		this._loadingState = resolveState<ILoadingState, boolean | any>(
			states?.loading,
			TLoadingState,
			loadingInitial,
		)

		// Устанавливаем начальное значение loading из props
		if (props.loading !== undefined) {
			this._loadingState.loading = props.loading
		}

		// При изменении loading синхронизируем disabled если задано в behavior
		this._loadingState.events.on('change', (value) => {
			if (this._loadingState.behavior.shouldDisable) {
				this._disableable.value = value.loading
			}
			this.events.emit('change:loading', value.loading)
		})
	}

	get appearance(): TButtonAppearance {
		return this._appearance
	}

	set appearance(value: TButtonAppearance) {
		if (value && this._appearance !== value) {
			this._appearance = value
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

	get classes(): string[] {
		const classes = [...super.classes]

		// Добавляем класс для внешнего вида, если он задан
		if (this._appearance) {
			classes.push(`${this._baseClass}--${this._appearance}`)
		}

		return classes
	}

	getProps(): IButtonProps {
		return {
			...super.getProps(),
			appearance: this._appearance,
			loading: this.loading,
		}
	}
}
