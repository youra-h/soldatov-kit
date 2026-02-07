import { TInputControl } from '../../base/input-control'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import type { ICheckBox, ICheckBoxProps, TCheckBoxEvents } from './types'


export default class TCheckBox
	extends TInputControl<boolean | undefined, ICheckBoxProps, TCheckBoxEvents>
	implements ICheckBox
{
	static override baseClass = 's-check-box'

	static defaultValues: Partial<ICheckBoxProps> = {
		...TInputControl.defaultValues,
		value: false,
		indeterminate: false,
		plain: false,
		variant: 'normal',
	}

	protected _indeterminate: boolean
	protected _plain: boolean

	constructor(options: IComponentViewOptions<ICheckBoxProps> | Partial<ICheckBoxProps> = {}) {
		super(options)

		const { props = {} as Partial<ICheckBoxProps> } = TComponentView.prepareOptions<ICheckBoxProps>(
			options as any,
		)

		this.value = props.value ?? (TCheckBox.defaultValues.value as boolean)
		this._indeterminate = props.indeterminate ?? TCheckBox.defaultValues.indeterminate!
		this._plain = props.plain ?? TCheckBox.defaultValues.plain!

		// legacy compat: UI layer historically listens to changeValue
		this.events.on('change:value' as any, (value: boolean | undefined) => {
			this.events.emit('changeValue' as any, value)
		})
	}

	get indeterminate(): boolean {
		return this._indeterminate
	}

	set indeterminate(value: boolean) {
		if (this._indeterminate !== value) {
			this._indeterminate = value
			this.events.emit('changeIndeterminate' as any, value)
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

	get classes(): string[] {
		const classes = [...super.classes]

		// Добавляем класс для внешнего вида, если он задан
		if (this._indeterminate) {
			classes.push(`${this._baseClass}--indeterminate`)
		}

		if (this._plain) {
			classes.push(`${this._baseClass}--plain`)
		}

		return classes
	}

	/**
	 * Переключает состояние чекбокса
	 * Если был indeterminate, то станет true
	 * Если было true, то станет false
	 */
	change(event?: Event) {
		const oldValue = this.value

		if (this.indeterminate) {
			this.indeterminate = false
			this.value = true
		} else {
			this.value = this.value === true ? false : true
		}

		if (oldValue !== this.value) {
			this.events.emit('change' as any, {
				event,
				value: this.value,
			})
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
