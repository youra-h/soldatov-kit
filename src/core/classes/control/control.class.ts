import { TComponent, defaultComponentValues, type IComponentOptions } from './../component'
import type { IControl, TControlEventsMap } from './types'
import type { TObjectProps } from '../object'
import type { TComponentSize } from '../../common/types'
import { TSize } from '../../common/size'

export const defaultValues: Partial<IControl> = {
	...defaultComponentValues,
	text: '',
	disabled: false,
	focused: false,
	size: 'normal',
}

export default class TControl<TEvents extends TControlEventsMap> extends TComponent<TEvents> implements IControl {
	protected _text: string
	protected _disabled: boolean
	protected _focused: boolean
	protected _sizeHelper: TSize<TComponentSize>

	constructor(options: IComponentOptions<IControl> = { props: {}, baseClass: 's-control' }) {
		super(options)

		const { props = {} } = options

		this._sizeHelper = new TSize<TComponentSize>({
			baseClass: this._baseClass,
			value: props.size ?? defaultValues.size!,
		})

		this._text = props.text ?? defaultValues.text!
		this._disabled = props.disabled ?? defaultValues.disabled!
		this._focused = props.focused ?? defaultValues.focused!
	}

	get text(): string {
		return this._text
	}

	set text(value: string) {
		if (this._text !== value) {
			this._text = value
			this.emit('changeText', value)
		}
	}

	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled !== value) {
			this._disabled = value
			this.emit('disabled', value)
		}
	}

	get focused(): boolean {
		return this._focused
	}

	set focused(value: boolean) {
		if (this._focused !== value) {
			this._focused = value
			this.emit('focus', value)
		}
	}

	get size(): TComponentSize {
		return this._sizeHelper.value
	}

	set size(value: TComponentSize) {
		if (this._sizeHelper.value !== value) {
			this._sizeHelper.value = value
		}
	}

	get classes(): string[] {
		const classes = []

		// Добавляем класс для размера
		classes.push(...this._sizeHelper.getClass())

		return classes
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			text: this._text,
			disabled: this._disabled,
			focused: this._focused,
			size: this._sizeHelper.value,
		}
	}

	afterHide(): void {
		super.afterHide()
		this._focused = false
	}
}
