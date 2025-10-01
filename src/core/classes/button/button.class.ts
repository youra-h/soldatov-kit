import { TComponent, type IComponentOptions } from './../component'
import { TControl, defaultValuesControl } from '../control'
import type { TComponentVariant } from '../../common/types'
import type { IButton, TButtonAppearance, TButtonEventsMap } from './types'
import type { TObjectProps } from '../object'
import { TIcon } from '../icon'
import { TVariant } from '../../common/variant'
import { TSpinner } from '../spinner'

export const defaultValues: Partial<IButton> = {
	...defaultValuesControl,
	variant: 'normal',
	appearance: 'normal',
	icon: undefined,
	tag: 'button',
	loading: false,
}

export default class TButton extends TControl<TButtonEventsMap> implements IButton {
	protected _variantHelper: TVariant
	protected _appearance: TButtonAppearance
	protected _icon?: TIcon
	protected _loading: boolean
	protected _spinner?: TSpinner

	constructor(options: IComponentOptions<IButton>) {
		options = TComponent.prepareOptions(options, 's-button')

		super(options)

		const { props = {} } = options

		this._tag = props.tag ?? defaultValues.tag!

		this._loading = props.loading ?? defaultValues.loading!
		this._spinner = props.spinner ?? defaultValues.spinner!

		this._variantHelper = new TVariant({
			baseClass: this._baseClass,
		})

		this._variantHelper.on('change', (value) => {
			// Если есть спиннер, синхронизируем его вариант с кнопкой
			this.spinner!.variant = value
		})

		// Инициализируем значение отображения компонента
		this._variantHelper.value = props.variant ?? defaultValues.variant!

		this._appearance = props.appearance ?? defaultValues.appearance!
		this.icon = props.icon ?? defaultValues.icon!

		this._sizeHelper.on('change', (value) => {
			// Если есть спиннер, синхронизируем его размер с кнопкой
			this.spinner!.size = value

			if (this._icon) {
				this._icon.size = value
			}
		})
	}

	get variant(): TComponentVariant {
		return this._variantHelper.value
	}

	set variant(value: TComponentVariant) {
		if (this._variantHelper.value !== value) {
			this._variantHelper.value = value
		}
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
					variant: this._variantHelper.value,
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
		const classes = [this._baseClass, ...super.classes]

		// Добавляем класс для внешнего вида, если он задан
		if (this._appearance) {
			classes.push(`${this._baseClass}--${this._appearance}`)
		}

		// Добавляем класс для варианта, если он задан
		classes.push(...this._variantHelper.getClass())

		return classes
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			variant: this._variantHelper.value,
			appearance: this._appearance,
			icon: this._icon,
		}
	}
}
