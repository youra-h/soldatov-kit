import { TComponent, type IComponentOptions } from '../component'
import type { TComponentVariant } from '../../common/types'
import { TControlValue } from '../control-value'
import type {
	IControlInput,
	IControlInputProps,
	TControlInputEvents,
	TControlInputState,
} from './types'
import { TVariant } from '../../common/variant'
import { TSpinner } from '../spinner'

export default class TControlInput<
		TProps extends IControlInputProps = IControlInputProps,
		TEvents extends TControlInputEvents = TControlInputEvents,
	>
	extends TControlValue<TProps, TEvents>
	implements IControlInput
{
	static defaultValues: Partial<IControlInputProps> = {
		...TControlValue.defaultValues,
		variant: 'normal',
		readonly: false,
		required: false,
		invalid: false,
		state: 'normal',
		loading: false,
	}

	/** Вспомогательный класс для работы с вариантом */
	protected _variantHelper: TVariant

	/** Значение недоступно для редактирования */
	protected _readonly: boolean
	/** Значение обязательно для заполнения */
	protected _required: boolean
	/** Значение не валидно */
	protected _invalid: boolean
	/** Состояние контрола */
	protected _state: TControlInputState
	/** Показать индикатор загрузки */
	protected _loading: boolean
	/** Индикатор загрузки */
	protected _spinner?: TSpinner

	constructor(options: IComponentOptions<IControlInputProps> = {}) {
		options = TComponent.prepareOptions(options, 's-control-input')

		super(options)

		const { props = {} } = options

		this._loading = props.loading ?? TControlInput.defaultValues.loading!
		this._spinner = props.spinner ?? TControlInput.defaultValues.spinner!

		this._variantHelper = new TVariant({
			baseClass: this._baseClass,
		})

		this._variantHelper.on('change', (value) => {
			// Если есть спиннер, синхронизируем его вариант с кнопкой
			this.spinner!.variant = value
		})

		// Инициализируем значение отображения компонента
		this._variantHelper.value = props.variant ?? TControlInput.defaultValues.variant!

		this._readonly = props.readonly ?? TControlInput.defaultValues.readonly!
		this._required = props.required ?? TControlInput.defaultValues.required!
		this._invalid = props.invalid ?? TControlInput.defaultValues.invalid!
		this._state = props.state ?? TControlInput.defaultValues.state!

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

	getProps(): TProps {
		return {
			...super.getProps(),
			variant: this.variant,
			readonly: this.readonly,
			required: this.required,
			invalid: this.invalid,
			state: this.state,
			loading: this.loading,
			spinner: this.spinner,
		}
	}
}
