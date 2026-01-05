import type { TDisableableState, TFocusableState } from '../states'
import { TDisableableState as TDisableableStateImpl } from '../states/disableable.state'
import { TFocusableState as TFocusableStateImpl } from '../states/focusable.state'
import TStylable from '../stylable/stylable.class'
import type { IUiControlProps, TUiControlEvents } from './types'

/**
 * База для UI-контролов: stylable (size/variant) + интерактивность (disabled/focused/click).
 *
 * Зачем отдельный слой:
 * - не все интерактивные элементы обязаны иметь size/variant
 * - но все form-controls (input элементы) и кнопки обычно обязаны
 */
export default class TUiControl<
	TProps extends IUiControlProps = IUiControlProps,
	TEvents extends TUiControlEvents = TUiControlEvents,
> extends TStylable<TProps, TEvents> {
	static defaultValues: Partial<IUiControlProps> = {
		...TStylable.defaultValues,
		disabled: false,
		focused: false,
	}

	protected _disableable: TDisableableState
	protected _focusable: TFocusableState

	constructor(options: any = {}) {
		super(options)
		const { props = {} } = options

		this._disableable = new TDisableableStateImpl(
			props.disabled ?? (TUiControl.defaultValues.disabled as boolean),
		)
		this._disableable.events.on('change', (value) => {
			this.events.emit('change:disabled' as any, value)
		})

		this._focusable = new TFocusableStateImpl(
			props.focused ?? (TUiControl.defaultValues.focused as boolean),
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
