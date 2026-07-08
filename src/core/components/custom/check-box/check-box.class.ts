import { TInputControl } from '../../base/input-control'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import type { ICheckBox, ICheckBoxProps, TCheckBoxEvents } from './types'
import { TEvented } from '../../../common/event/evented'

export default class TCheckBox
	extends TInputControl<boolean | undefined, ICheckBoxProps, TCheckBoxEvents>
	implements ICheckBox {
	static override baseClass = 's-check-box'

	static defaultValues: Partial<ICheckBoxProps> = {
		...TInputControl.defaultValues,
		value: false,
		indeterminate: false,
		plain: false,
		variant: 'normal',
	}

	protected _indeterminate!: boolean
	protected _plain!: boolean

	constructor(options: IComponentViewOptions<ICheckBoxProps> | Partial<ICheckBoxProps> = {}) {
		super(options)

		const ctor = new.target as typeof TCheckBox

		const { props = {} as Partial<ICheckBoxProps> } =
			TComponentView.prepareOptions<ICheckBoxProps>(options)

		this.value = props.value ?? (ctor.defaultValues.value as boolean)
		this._applyIndeterminate(props.indeterminate ?? ctor.defaultValues.indeterminate!)
		this._applyPlain(props.plain ?? ctor.defaultValues.plain!)
	}
	get indeterminate(): boolean {
		return this._indeterminate
	}

	protected _applyIndeterminate(value: boolean) {
		this._classes.toggle(`--indeterminate`, value)

		this._indeterminate = value
	}

	set indeterminate(value: boolean) {
		if (this._indeterminate !== value) {
			this._applyIndeterminate(value)
				; (this.events as TEvented<TCheckBoxEvents>).emit('change:indeterminate', value)
		}
	}

	get plain(): boolean {
		return this._plain
	}

	protected _applyPlain(value: boolean) {
		this._classes.toggle(`--plain`, value)

		this._plain = value
	}

	set plain(value: boolean) {
		if (this._plain !== value) {
			this._applyPlain(value)
				; (this.events as TEvented<TCheckBoxEvents>).emit('change:plain', value)
		}
	}

	/**
	 * Переключает состояние чекбокса
	 * Если был indeterminate, то станет true
	 * Если было true, то станет false
	 */
	toggle(): void {
		if (this.indeterminate) {
			this.indeterminate = false
			this.value = true
		} else {
			this.value = this.value === true ? false : true
		}
	}

	/**
	 * Возвращает значение для aria-атрибута checked
	 * @returns 'true' | 'false' | 'mixed'
	 */
	getAriaChecked(): 'true' | 'false' | 'mixed' {
		if (this.indeterminate) {
			return 'mixed'
		}

		return String(!!this.value) as 'true' | 'false'
	}

	getProps(): ICheckBoxProps {
		return {
			...super.getProps(),
			indeterminate: this.indeterminate,
			plain: this.plain,
		}
	}
}
