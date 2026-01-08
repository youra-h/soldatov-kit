import { TDisableableState, TFocusableState } from '../states'
import type { IDisableableState, IFocusableState } from '../states'
import { TPresentable } from '../presentable'
import type { IPresentableOptions } from '../presentable'
import { TStylable } from '../stylable'
import { resolveState } from '../../common/resolve-state'
import type { IControlProps, TControlEvents, TControlStatesOptions } from './types'

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
	TStates extends TControlStatesOptions = TControlStatesOptions,
> extends TStylable<TProps, TEvents> {
	static defaultValues: Partial<IControlProps> = {
		...TStylable.defaultValues,
		disabled: false,
		focused: false,
	}

	protected _disableable: IDisableableState
	protected _focusable: IFocusableState

	constructor(options: IPresentableOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TPresentable.prepareOptions<
			TProps,
			TStates
		>(options)

		const disabled = props.disabled ?? (TControl.defaultValues.disabled as boolean)
		const focused = props.focused ?? (TControl.defaultValues.focused as boolean)

		this._disableable = resolveState<IDisableableState, boolean>(
			states?.disableable,
			TDisableableState,
			disabled,
		)

		this._disableable.events.on('change', (value) => {
			this.events.emit('change:disabled' as any, value)
		})

		this._focusable = resolveState<IFocusableState, boolean>(
			states?.focusable,
			TFocusableState,
			focused,
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
