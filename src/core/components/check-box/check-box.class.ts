import { type IComponentModelOptions } from '../../base/component'
import { TControlInput } from '../control-input'
import type { ICheckBox, ICheckBoxProps, TCheckBoxEvents } from './types'
import { TIcon } from '../icon'

export default class TCheckBox extends TControlInput<ICheckBoxProps, TCheckBoxEvents> implements ICheckBox {
	static defaultValues: Partial<ICheckBoxProps> = {
		...TControlInput.defaultValues,
		value: false,
		indeterminate: false,
		plain: false,
		variant: 'normal',
	}

	protected _value: boolean | null
	protected _indeterminate: boolean
	protected _plain: boolean
	protected _icon?: TIcon
	protected _indeterminateIcon?: TIcon

	constructor(options: IComponentModelOptions<ICheckBoxProps> = {}) {
		const { props = {}, baseClass = 's-check-box' } = options

		super({ props, baseClass })

		this._value = props.value ?? TCheckBox.defaultValues.value!
		this._indeterminate = props.indeterminate ?? TCheckBox.defaultValues.indeterminate!
		this._plain = props.plain ?? TCheckBox.defaultValues.plain!
		this._icon = props.icon ?? TCheckBox.defaultValues.icon!
		this._indeterminateIcon =
			props.indeterminateIcon ?? TCheckBox.defaultValues.indeterminateIcon!
	}

	get value(): boolean | null {
		return this._value
	}

	set value(value: boolean | null) {
		if (this._value !== value) {
			this._value = value

			this.events.emit('changeValue', value)
		}
	}

	get indeterminate(): boolean {
		return this._indeterminate
	}

	set indeterminate(value: boolean) {
		if (this._indeterminate !== value) {
			this._indeterminate = value
			this.events.emit('changeIndeterminate', value)
		}
	}

	get plain(): boolean {
		return this._plain
	}

	set plain(value: boolean) {
		if (this._plain !== value) {
			this._plain = value
		}
	}

	get icon(): TIcon | undefined {
		return this._icon
	}

	set icon(value: TIcon | undefined) {
		if (this._icon !== value) {
			this._icon = value ? TIcon.getInstance(value) : undefined

			if (this._icon) {
				this._icon.size = this.size
			}
		}
	}

	get indeterminateIcon(): TIcon | undefined {
		return this._indeterminateIcon
	}

	set indeterminateIcon(value: TIcon | undefined) {
		if (this._indeterminateIcon !== value) {
			this._indeterminateIcon = value ? TIcon.getInstance(value) : undefined

			if (this._indeterminateIcon) {
				this._indeterminateIcon.size = this.size
			}
		}
	}

	get classes(): string[] {
		const classes = [...super.classes]

		// Добавляем класс для внешнего вида, если он задан
		if (this._indeterminate) {
			classes.push(`${this._baseClass}--indeterminate`)
		}

		if (this._plain) {
			classes.push(`${this._baseClass}--plain`)
		}

		return classes
	}

	/**
	 * Переключает состояние чекбокса
	 * Если был indeterminate, то станет true
	 * Если было true, то станет false
	 */
	change(event?: Event) {
		const oldValue = this._value

		if (this.indeterminate) {
			this.indeterminate = false
			this.value = true
		} else {
			this.value = this.value === true ? false : true
		}

		if (oldValue !== this._value) {
			this.events.emit('change', {
				event,
				value: this._value,
			})
		}
	}

	/**
	 * Возвращает значение для aria-атрибута checked
	 * @returns 'true' | 'false' | 'mixed'
	 */
	getAriaChecked(): 'true' | 'false' | 'mixed' {
		if (this.indeterminate) {
			return 'mixed'
		}

		return String(!!this.value) as 'true' | 'false'
	}

	getProps(): ICheckBoxProps {
		return {
			...super.getProps(),
			indeterminate: this.indeterminate,
			plain: this.plain,
			icon: this.icon,
			indeterminateIcon: this.indeterminateIcon,
		}
	}
}
