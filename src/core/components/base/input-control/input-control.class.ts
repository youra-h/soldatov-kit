import { TValueControl } from '../value-control'
import type { IInputControlProps, TInputControlEvents, TInputControlStates } from './types'
import type { IComponentViewOptions } from '../component-view'
import { TComponentView } from '../component-view'
import { TEvented } from '../../../common'

/**
 * База для input-элементов (текстовые поля, checkbox, switch и т.д.).
 *
 * Наследует:
 * - интерактивность (disabled/focused)
 * - значение `value` (commit + input)
 * - name
 */
export default class TInputControl<
	TValue = string,
	TProps extends IInputControlProps<TValue> = IInputControlProps<TValue>,
	TEvents extends TInputControlEvents<TValue> = TInputControlEvents<TValue>,
	TStates extends TInputControlStates<TValue> = TInputControlStates<TValue>,
> extends TValueControl<TValue, TProps, TEvents> {
	static defaultValues: Partial<IInputControlProps<any>> = {
		...TValueControl.defaultValues,
		readonly: false,
		required: false,
	}

	protected _readonly!: boolean
	protected _required!: boolean

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const ctor = new.target as typeof TInputControl

		const { props = {} as Partial<TProps> } = TComponentView.prepareOptions<TProps, TStates>(
			options,
		)

		// Простые свойства
		// this._readonly = props.readonly ?? (ctor.defaultValues.readonly as boolean)
		this._applyReadonly(props.readonly ?? (ctor.defaultValues.readonly as boolean))
		this._applyRequired(props.required ?? (ctor.defaultValues.required as boolean))
	}

	get readonly(): boolean {
		return this._readonly
	}

	protected _applyReadonly(value: boolean) {
		this._classes.toggle(`--readonly`, value)

		this._readonly = value
	}

	set readonly(value: boolean) {
		if (this._readonly === value) return

		this._applyReadonly(value)
		;(this.events as TEvented<TInputControlEvents<TValue>>).emit('change:readonly', value)
	}

	get required(): boolean {
		return this._required
	}

	protected _applyRequired(value: boolean) {
		this._classes.toggle(`--required`, value)

		this._required = value
	}

	set required(value: boolean) {
		if (this._required === value) return

		this._applyRequired(value)
		;(this.events as TEvented<TInputControlEvents<TValue>>).emit('change:required', value)
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			readonly: this._readonly,
			required: this._required,
		} as TProps
	}
}
