import { AbstractControlItem } from './control-item.class'
import { type IControlValue, TControlValue } from '../../control-value'
import type { IControlValueItem } from './types'

/**
 * Абстрактный элемент коллекции для UI-контролов.
 * Наследники должны расширять assign и могут добавлять свои поля.
 */
export abstract class AbstractControlValueItem<
		TControlType extends TControlValue<any> = TControlValue<any>,
		TProps extends IControlValueItem = IControlValueItem,
	>
	extends AbstractControlItem<TControlType, TProps>
	implements IControlValue
{
	get value(): any {
		return this._control!.value
	}
	set value(value: any) {
		this._control!.value = value
	}
}
