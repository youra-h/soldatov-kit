import { TTextable } from '../../base/textable'
import type { IButton, IButtonProps, TButtonAppearance, TButtonEvents, TButtonStatesOptions } from './types'
import { TIcon } from '../icon'
import { TSpinner } from '../spinner'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import { TLoadingState, type ILoadingState } from '../../base/states'
import { resolveState } from '../../common/resolve-state'

export default class TButton extends TTextable<IButtonProps, TButtonEvents> implements IButton {
	static override baseClass = 's-button'

	static defaultValues: Partial<IButtonProps> = {
		...TTextable.defaultValues,
		variant: 'normal',
		appearance: 'normal',
		icon: undefined,
		tag: 'button',
		loading: false,
	}

	protected _appearance: TButtonAppearance
	protected _icon?: TIcon
	protected _loadingState: ILoadingState<TSpinner>

	constructor(options: IComponentViewOptions<IButtonProps, TButtonStatesOptions> | Partial<IButtonProps> = {}) {
		super(options)

		const { props = {}, states } = TComponentView.prepareOptions<IButtonProps, TButtonStatesOptions>(options)

		this._tag = props.tag ?? TButton.defaultValues.tag!

		this._appearance = props.appearance ?? TButton.defaultValues.appearance!
		this.icon = props.icon ?? TButton.defaultValues.icon!

		// Создаем loading state с дефолтным поведением для кнопки
		// Если передан states.loading, используем его, иначе создаем с дефолтным behavior
		const loadingInitial = states?.loading
			? undefined // resolveState сам разберется
			: {
				shouldDisable: true,
				createSpinner: () => new TSpinner({
					props: {
						size: this.size,
						variant: this.variant,
					},
				}),
			}

		this._loadingState = resolveState<ILoadingState<TSpinner>, boolean | any>(
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

		// Синхронизируем size/variant со spinner
		this.events.on('change:variant', (value) => {
			if (this._loadingState.spinner) {
				this._loadingState.spinner.variant = value
			}
		})

		this.events.on('change:size', (value) => {
			if (this._loadingState.spinner) {
				this._loadingState.spinner.size = value
			}

			if (this._icon) {
				this._icon.size = value
			}
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

	get icon(): TIcon | undefined {
		return this._icon
	}

	set icon(value: TIcon | undefined) {
		if (this._icon !== value) {
			// Если value не типа TIcon, создаем новый экземпляр
			this._icon = value ? TIcon.getInstance(value) : undefined

			if (this._icon) {
				this._icon.size = this.size
			}
		}
	}

	get loading(): boolean {
		return this._loadingState.loading
	}

	set loading(value: boolean) {
		this._loadingState.loading = value
	}

	get spinner(): TSpinner | undefined {
		return this._loadingState.spinner
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
			icon: this._icon,
			loading: this.loading,
		}
	}
}
