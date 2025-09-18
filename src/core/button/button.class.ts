import { TControl, defaultControlValues } from '../control'
import type { TVariant } from '../utils/types'
import type { IButton, TButtonAppearance, TButtonEventsMap } from './types'
import type { TObjectProps } from '../object'

export const defaultValues: Partial<IButton> = {
	...defaultControlValues,
	variant: 'normal',
	appearance: 'normal',
}

export default class TButton extends TControl<TButtonEventsMap> implements IButton {
	private _variant: TVariant
	private _appearance: TButtonAppearance
	private _tag: string = 'button'

	constructor(props: Partial<IButton> = {}) {
		super(props)

		this._baseClass = 's-button'

		this._variant = props.variant ?? defaultValues.variant!
		this._appearance = props.appearance ?? defaultValues.appearance!
	}

	get variant(): TVariant {
		return this._variant
	}

	set variant(value: TVariant) {
		this._variant = value
	}

	get appearance(): TButtonAppearance {
		return this._appearance
	}

	set appearance(value: TButtonAppearance) {
		if (value && this._appearance !== value) {
			this._appearance = value
			// Изменяем тег в зависимости от внешнего вида
			this._tag = value === 'label' ? 'label' : 'button'
		}
	}

	get classes(): string[] {
		const classes = [this._baseClass]

		// Добавляем класс для внешнего вида, если он задан
		if (this._appearance) {
			classes.push(`${this._baseClass}--${this._appearance}`)
		}

		// Добавляем класс для варианта, если он задан
		if (this._variant && this._variant !== 'normal') {
			classes.push(`${this._baseClass}--${this._variant}`)
		}

		// Добавляем класс для размера
		if (this.size && this.size !== 'normal') {
			classes.push(`${this._baseClass}--size-${this.size}`)
		}

		return classes
	}

	get tag(): string {
		return this._tag
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			variant: this._variant,
			appearance: this._appearance,
		}
	}
}
