import { TComponent, type IComponentOptions } from '../component'
import type { TComponentVariant } from '../../common/types'
import { TControlValue, defaultValuesControlValue } from '../control-value'
import type { IControlInput, TControlInputEvents, TControlInputState } from './types'
import type { TObjectProps } from '../object'
import { TVariant } from '../../common/variant'
import { TSpinner } from '../spinner'

export const defaultValues: Partial<IControlInput> = {
	...defaultValuesControlValue,
	variant: 'normal',
	readonly: false,
	required: false,
	invalid: false,
	state: 'normal',
	loading: false,
}

export default class TControlInput<TEvents extends TControlInputEvents>
	extends TControlValue<TEvents>
	implements IControlInput
{
	protected _variantHelper: TVariant

	protected _readonly: boolean
	protected _required: boolean
	protected _invalid: boolean
	protected _state: TControlInputState
	protected _loading: boolean
	protected _spinner?: TSpinner

	constructor(options: IComponentOptions<IControlInput>) {
		options = TComponent.prepareOptions(options, 's-control-input')

		super(options)

		const { props = {} } = options

		this._loading = props.loading ?? defaultValues.loading!
		this._spinner = props.spinner ?? defaultValues.spinner!

		this._variantHelper = new TVariant({
			baseClass: this._baseClass,
		})

		this._variantHelper.on('change', (value) => {
			// Если есть спиннер, синхронизируем его вариант с кнопкой
			this.spinner!.variant = value
		})

		// Инициализируем значение отображения компонента
		this._variantHelper.value = props.variant ?? defaultValues.variant!

		this._readonly = props.readonly ?? defaultValues.readonly!
		this._required = props.required ?? defaultValues.required!
		this._invalid = props.invalid ?? defaultValues.invalid!
		this._state = props.state ?? defaultValues.state!

		this._sizeHelper.on('change', (value) => {
			debugger
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
		}
	}

	get required(): boolean {
		return this._required
	}

	set required(value: boolean) {
		if (this._required !== value) {
			this._required = value
		}
	}

	get invalid(): boolean {
		return this._invalid
	}

	set invalid(value: boolean) {
		if (this._invalid !== value) {
			this._invalid = value

			if (value) {
				this.state = 'error'
			}
		}
	}

	get state(): TControlInputState {
		return this._state
	}

	set state(value: TControlInputState) {
		if (this._state !== value) {
			this._state = value
		}
	}

	get loading(): boolean {
		return this._loading
	}

	set loading(value: boolean) {
		if (this._loading !== value) {
			this._loading = value
		}
	}

	get spinner(): TSpinner | undefined {
		// Если включается режим загрузки и не задан спиннер, создаем его
		if (!this._spinner) {
			this._spinner = new TSpinner({
				props: {
					size: this.size,
					variant: this._variantHelper.value,
				},
			})
		}

		return this._spinner
	}

	set spinner(value: TSpinner | undefined) {
		if (this._spinner !== value) {
			this._spinner = value
		}
	}

	get classes(): string[] {
		const classes = [this._baseClass, ...super.classes]

		// Добавляем класс для варианта, если он задан
		classes.push(...this._variantHelper.getClass())

		return classes
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			readonly: this.readonly,
			required: this.required,
			invalid: this.invalid,
			state: this.state,
		}
	}
}
