import { AbstractControlItem } from './control-item.class'
import { type IControlValue, defaultValuesControlValue } from '../../control-value'

/**
 * Абстрактный элемент коллекции для UI-контролов.
 * Наследники должны расширять assign и могут добавлять свои поля.
 */
export abstract class AbstractControlValueItem
	extends AbstractControlItem
	implements IControlValue
{
	/** Значение контрола */
	protected _value: any = defaultValuesControlValue.value!

	constructor() {
		super()

		this._sizeHelper.baseClass = 's-abstract-control-value-item'
	}

	/**
	 * Копирует данные из source в текущий элемент.
	 * Наследники должны вызывать super.assign(source) и копировать свои поля.
	 * @param source Источник данных
	 */
	assign(source: AbstractControlValueItem): void {
		super.assign(source)

		if (!source) return

		// Копируем только свои поля
		this._value = source.value ?? defaultValuesControlValue.value!
	}

	get value(): any {
		return this._value
	}
	set value(newValue: any) {
		if (this._value !== newValue) {
			this._value = newValue
			this.changed()
		}
	}

	/**
	 * Уведомляет, что элемент изменился (для реактивного обновления владельца).
	 */
	changed(): void {
		super.changed()
	}
}
