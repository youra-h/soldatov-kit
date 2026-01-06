import { TControl } from '../../base/control'
import type { IButton, IButtonProps, TButtonAppearance, TButtonEvents } from './types'
import { TIcon } from '../icon'
import { TSpinner } from '../spinner'
import type { IPresentableOptions } from '../../base/presentable'

export default class TButton extends TControl<IButtonProps, TButtonEvents> implements IButton {
	static override baseClass = 's-button'

	static defaultValues: Partial<IButtonProps> = {
		...TControl.defaultValues,
		variant: 'normal',
		appearance: 'normal',
		icon: undefined,
		tag: 'button',
		loading: false,
	}

	protected _appearance: TButtonAppearance
	protected _icon?: TIcon
	protected _loading: boolean
	protected _spinner?: TSpinner

	constructor(options: IPresentableOptions<IButtonProps> | Partial<IButtonProps> = {}) {
		const ctor = new.target as typeof TButton
		const prepared = ctor.prepareOptions<IButtonProps>(options)
		super(prepared)

		const { props = {} } = prepared

		this._tag = props.tag ?? TButton.defaultValues.tag!

		this._loading = props.loading ?? TButton.defaultValues.loading!
		this._spinner = props.spinner ?? TButton.defaultValues.spinner!

		this._appearance = props.appearance ?? TButton.defaultValues.appearance!
		this.icon = props.icon ?? TButton.defaultValues.icon!

		this.events.on('change:variant' as any, (value: any) => {
			// Если есть спиннер, синхронизируем его вариант с кнопкой
			this.spinner!.variant = value
		})

		this.events.on('change:size' as any, (value: any) => {
			// Если есть спиннер, синхронизируем его размер с кнопкой
			this.spinner!.size = value

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
		return this._loading
	}

	set loading(value: boolean) {
		if (this._loading !== value) {
			this._loading = value
		}
	}

	get spinner(): TSpinner | undefined {
		// Если включается режим загрузки и не задан спиннер, создаем его
		if (!this._spinner) {
			this._spinner = new TSpinner({
				props: {
					size: this.size,
					variant: this.variant,
				},
			})
		}

		return this._spinner
	}

	set spinner(value: TSpinner | undefined) {
		if (this._spinner !== value) {
			this._spinner = value
		}
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
			loading: this._loading,
			spinner: this._spinner,
		}
	}
}
