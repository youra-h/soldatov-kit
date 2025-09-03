import { TControl, defaultControlValues } from '../control'
import type { TVariant } from '../utils/types'
import type { IButton, TButtonAppearance, TButtonEventsMap } from './types'
import type { TObjectProps } from '../object'

export const defaultValues: Partial<IButton> = {
	...defaultControlValues,
	variant: 'primary',
	appearance: 'filled',
}

export default class TButton extends TControl<TButtonEventsMap> implements IButton {
	private _variant: TVariant
	private _appearance: TButtonAppearance

	constructor(props: Partial<IButton> = {}) {
		super(props)

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
		this._appearance = value
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			variant: this._variant,
			appearance: this._appearance,
		}
	}
}
