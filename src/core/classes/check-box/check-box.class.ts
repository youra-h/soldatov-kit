import { type IComponentOptions } from '../component'
import { TControlInput, defaultValuesControlInput } from '../control-input'
import type { ICheckBox, TCheckBoxEventsMap } from './types'
import type { TObjectProps } from '../object'
import { TIcon } from '../icon'

export const defaultValues: Partial<ICheckBox> = {
	...defaultValuesControlInput,
	value: false,
	indeterminate: false,
	plain: false,
	variant: 'normal',
}

export default class TCheckBox<TEvents extends TCheckBoxEventsMap>
	extends TControlInput<TEvents>
	implements ICheckBox
{
	protected _value: boolean | null
	protected _indeterminate: boolean
	protected _plain: boolean
	protected _icon?: TIcon
	protected _indeterminateIcon?: TIcon

	constructor(options: IComponentOptions<ICheckBox>) {
		const { props = {}, baseClass = 's-check-box' } = options

		super({ props, baseClass })

		this._value = props.value ?? defaultValues.value!
		this._indeterminate = props.indeterminate ?? defaultValues.indeterminate!
		this._plain = props.plain ?? defaultValues.plain!
		this._icon = props.icon ?? defaultValues.icon!
		this._indeterminateIcon = props.indeterminateIcon ?? defaultValues.indeterminateIcon!
	}

	get value(): boolean | null {
		return this._value
	}

	set value(value: boolean | null) {
		if (this._value !== value) {
			this._value = value
			this.emit('changeValue', value)
		}
	}

	get indeterminate(): boolean {
		return this._indeterminate
	}

	set indeterminate(value: boolean) {
		if (this._indeterminate !== value) {
			this._indeterminate = value
			this.emit('changeIndeterminate', value)
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
			this.emit('change', {
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

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			indeterminate: this.indeterminate,
			plain: this.plain,
			icon: this.icon,
			indeterminateIcon: this.indeterminateIcon,
		}
	}
}
