import { AbstractControlItem } from './control-item.class'
import { type IControlValue, TControlValue } from '../../control-value'

/**
 * Абстрактный элемент коллекции для UI-контролов.
 * Наследники должны расширять assign и могут добавлять свои поля.
 */
export abstract class AbstractControlValueItem<
		TControlType extends TControlValue<any> = TControlValue<any>,
	>
	extends AbstractControlItem<TControlType>
	implements IControlValue
{
	constructor(control?: TControlType) {
		super(control ?? (TControlValue.create() as TControlType))
	}

	get value(): any {
		return this._control.value
	}
	set value(value: any) {
		this._control.value = value
	}
}
