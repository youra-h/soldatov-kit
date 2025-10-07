import { AbstractControlValueItem } from './control-value-item.class'
import {
	type IControlInput,
	defaultValuesControlInput,
	type TControlInputState,
} from '../../control-input'
import type { TComponentVariant } from '../../../common/types'
import { TSpinner } from '../../spinner'
import { TVariant } from '../../../common/variant'

/**
 * Абстрактный элемент коллекции для UI-контролов.
 * Наследники должны расширять assign и могут добавлять свои поля.
 */
export abstract class AbstractControlInputItem
	extends AbstractControlValueItem
	implements IControlInput
{
	/** Вариант отображения */
	protected _variantHelper: TVariant

	/** Значение недоступно для редактирования */
	protected _readonly: boolean = defaultValuesControlInput.readonly!
	/** Значение обязательно для заполнения */
	protected _required: boolean = defaultValuesControlInput.required!
	/** Значение не валидно */
	protected _invalid: boolean = defaultValuesControlInput.invalid!
	/** Состояние контрола */
	protected _state: TControlInputState = defaultValuesControlInput.state!
	/** Показать индикатор загрузки */
	protected _loading: boolean = defaultValuesControlInput.loading!
	/** Индикатор загрузки */
	protected _spinner: TSpinner = defaultValuesControlInput.spinner!

	constructor() {
		super()

		const baseClass = 's-abstract-control-input-item'

		this._sizeHelper.baseClass = baseClass

		this._variantHelper = new TVariant({
			baseClass,
		})

		this._variantHelper.on('change', (value) => {
			// Если есть спиннер, синхронизируем его вариант с кнопкой
			this.spinner!.variant = value
		})

		this._sizeHelper.on('change', (value) => {
			// Если есть спиннер, синхронизируем его размер с кнопкой
			this.spinner!.size = value
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

	get readonly(): boolean {
		return this._readonly
	}

	set readonly(value: boolean) {
		if (this._readonly !== value) {
			this._readonly = value
			this.changed()
		}
	}

	get required(): boolean {
		return this._required
	}

	set required(value: boolean) {
		if (this._required !== value) {
			this._required = value
			this.changed()
		}
	}

	get invalid(): boolean {
		return this._invalid
	}

	set invalid(value: boolean) {
		if (this._invalid !== value) {
			this._invalid = value
			this.changed()
		}
	}

	get state(): TControlInputState {
		return this._state
	}

	set state(value: TControlInputState) {
		if (this._state !== value) {
			this._state = value
			this.changed()
		}
	}

	get loading(): boolean {
		return this._loading
	}

	set loading(value: boolean) {
		if (this._loading !== value) {
			this._loading = value
			this.changed()
		}
	}

	get spinner(): TSpinner {
		return this._spinner
	}

	set spinner(value: TSpinner) {
		if (this._spinner !== value) {
			this._spinner = value
			this.changed()
		}
	}

	/**
	 * Копирует данные из source в текущий элемент.
	 * Наследники должны вызывать super.assign(source) и копировать свои поля.
	 * @param source Источник данных
	 */
	assign(source: AbstractControlInputItem): void {
		super.assign(source)

		if (!source) return

		// Копируем только свои поля
		this._readonly = source.readonly ?? defaultValuesControlInput.readonly!
	}

	/**
	 * Уведомляет, что элемент изменился (для реактивного обновления владельца).
	 */
	changed(): void {
		super.changed()
	}
}
