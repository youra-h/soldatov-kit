import type { TDisableableState, TFocusableState } from '../states'
import { TDisableableState as TDisableableStateImpl } from '../states/disableable.state'
import { TFocusableState as TFocusableStateImpl } from '../states/focusable.state'
import TPresentable from '../presentable/presentable.class'
import type { IPresentableOptions } from '../presentable'
import TStylable from '../stylable/stylable.class'
import type { IControlProps, TControlEvents } from './types'

/**
 * База для Ui-контролов: stylable (size/variant) + интерактивность (disabled/focused/click).
 *
 * Зачем отдельный слой:
 * - не все интерактивные элементы обязаны иметь size/variant
 * - но все form-controls (input элементы) и кнопки обычно обязаны
 */
export default class TControl<
	TProps extends IControlProps = IControlProps,
	TEvents extends TControlEvents = TControlEvents,
> extends TStylable<TProps, TEvents> {
	static defaultValues: Partial<IControlProps> = {
		...TStylable.defaultValues,
		disabled: false,
		focused: false,
	}

	protected _disableable: TDisableableState
	protected _focusable: TFocusableState

	constructor(options: IPresentableOptions<TProps> | Partial<TProps> = {}) {
		super(options)
		const { props = {} as Partial<TProps> } = TPresentable.prepareOptions<TProps>(options as any)

		this._disableable = new TDisableableStateImpl(
			props.disabled ?? (TControl.defaultValues.disabled as boolean),
		)
		this._disableable.events.on('change', (value) => {
			this.events.emit('change:disabled' as any, value)
		})

		this._focusable = new TFocusableStateImpl(
			props.focused ?? (TControl.defaultValues.focused as boolean),
		)
		this._focusable.events.on('change', (value) => {
			this.events.emit('change:focused' as any, value)
		})
	}

	get disabled(): boolean {
		return this._disableable.disabled
	}
	set disabled(value: boolean) {
		this._disableable.disabled = value
	}

	get focused(): boolean {
		return this._focusable.focused
	}
	set focused(value: boolean) {
		this._focusable.focused = value
	}

	click(event: Event): void {
		this.events.emit('click' as any, event)
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			disabled: this.disabled,
			focused: this.focused,
		} as TProps
	}
}
