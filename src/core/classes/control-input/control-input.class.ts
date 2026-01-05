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
import { TInputStateBehavior } from '../behavior/input-state.behavior'

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
	protected _inputState: TInputStateBehavior
	/** Индикатор загрузки */
	protected _spinner?: TSpinner

	constructor(options: IComponentOptions<IControlInputProps> = {}) {
		options = TComponent.prepareOptions(options, 's-control-input')

		super(options)

		const { props = {} } = options

		this._spinner = props.spinner ?? TControlInput.defaultValues.spinner!

		this._variantHelper = new TVariant({
			baseClass: this._baseClass,
		})

		this._variantHelper.events.on('change', (value) => {
			// Если есть спиннер, синхронизируем его вариант с кнопкой
			this.spinner!.variant = value
		})

		// Инициализируем значение отображения компонента
		this._variantHelper.value = props.variant ?? TControlInput.defaultValues.variant!

		this._inputState = new TInputStateBehavior(this, {
			readonly: props.readonly ?? TControlInput.defaultValues.readonly!,
			required: props.required ?? TControlInput.defaultValues.required!,
			invalid: props.invalid ?? TControlInput.defaultValues.invalid!,
			state: props.state ?? TControlInput.defaultValues.state!,
			loading: props.loading ?? TControlInput.defaultValues.loading!,
		})

		this._sizeHelper.events.on('change', (value) => {
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
		return this._inputState.readonly
	}

	set readonly(value: boolean) {
		this._inputState.readonly = value
	}

	get required(): boolean {
		return this._inputState.required
	}

	set required(value: boolean) {
		this._inputState.required = value
	}

	get invalid(): boolean {
		return this._inputState.invalid
	}

	set invalid(value: boolean) {
		this._inputState.invalid = value
	}

	get state(): TControlInputState {
		return this._inputState.state
	}

	set state(value: TControlInputState) {
		this._inputState.state = value
	}

	get loading(): boolean {
		return this._inputState.loading
	}

	set loading(value: boolean) {
		this._inputState.loading = value
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
			readonly: this._inputState.readonly,
			required: this._inputState.required,
			invalid: this._inputState.invalid,
			state: this._inputState.state,
			loading: this._inputState.loading,
			spinner: this.spinner,
		}
	}

	change(event: Event): void {
		// Метод-заглушка, должен быть переопределен в наследниках
		this.events.emit('change', { event, value: this.value })
	}
}
