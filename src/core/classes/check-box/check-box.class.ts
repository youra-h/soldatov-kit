import { type IComponentOptions } from '../component'
import { TControlValue, defaultValuesControlValue } from '../control-value'
import type { ICheckBox, TCheckBoxEventsMap } from './types'
import type { TObjectProps } from '../object'
import { TIcon } from '../icon'
import { TVariant } from '../../common/variant'
import type { TComponentVariant } from '../../common/types'

export const defaultValues: Partial<ICheckBox> = {
	...defaultValuesControlValue,
	indeterminate: false,
	plain: false,
	variant: 'normal',
}

export default class TCheckBox<TEvents extends TCheckBoxEventsMap>
	extends TControlValue<TEvents>
	implements ICheckBox
{
	protected _indeterminate: boolean
	protected _plain: boolean
	protected _variantHelper: TVariant
	protected _icon?: TIcon
	protected _indeterminateIcon?: TIcon

	constructor(options: IComponentOptions<ICheckBox> = { props: {}, baseClass: 's-check-box' }) {
		super(options)

		const { props = {} } = options

		this._variantHelper = new TVariant({
			baseClass: this._baseClass,
		})

		// Инициализируем значение отображения компонента
		this._variantHelper.value = props.variant ?? defaultValues.variant!

		this._indeterminate = props.indeterminate ?? defaultValues.indeterminate!
		this._plain = props.plain ?? defaultValues.plain!
		this._icon = props.icon ?? defaultValues.icon!
		this._indeterminateIcon = props.indeterminateIcon ?? defaultValues.indeterminateIcon!
	}

	get variant(): TComponentVariant {
		return this._variantHelper.value
	}

	set variant(value: TComponentVariant) {
		if (this._variantHelper.value !== value) {
			this._variantHelper.value = value
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
		}
	}

	get indeterminateIcon(): TIcon | undefined {
		return this._indeterminateIcon
	}

	set indeterminateIcon(value: TIcon | undefined) {
		if (this._indeterminateIcon !== value) {
			this._indeterminateIcon = value ? TIcon.getInstance(value) : undefined
		}
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			value: this._value,
		}
	}
}
