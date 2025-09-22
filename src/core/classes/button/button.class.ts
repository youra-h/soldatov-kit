import { TControl, defaultControlValues } from '../control'
import type { TComponentVariant } from '../../common/types'
import type { IButton, TButtonAppearance, TButtonEventsMap } from './types'
import type { TObjectProps } from '../object'
import { TIcon } from '../icon'
import { TVariant } from '../../common/variant'

export const defaultValues: Partial<IButton> = {
	...defaultControlValues,
	variant: 'normal',
	appearance: 'normal',
	icon: undefined,
	tag: 'button',
}

export default class TButton extends TControl<TButtonEventsMap> implements IButton {
	private _variantHelper: TVariant
	private _appearance: TButtonAppearance
	private _icon?: TIcon

	constructor(props: Partial<IButton> = {}, baseClass: string = 's-button') {
		super(props, baseClass)

		this._tag = props.tag ?? defaultValues.tag!

		this._variantHelper = new TVariant({
			baseClass: this._baseClass,
			defaultValue: props.variant ?? defaultValues.variant!,
		})

		this._appearance = props.appearance ?? defaultValues.appearance!
		this._icon = props.icon ?? defaultValues.icon!
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
			this._icon = value
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
