import { TDisableableState, TFocusableState } from '../states'
import type { IDisableableState, IFocusableState } from '../states'
import { TPresentable, type IPresentableOptions } from '../presentable'
import { resolveState } from '../../common/resolve-state'
import type { IInteractiveProps, TInteractiveEvents, TInteractiveStatesOptions } from './types'

/**
 * База для интерактивных компонентов: disabled + focused.
 *
 * Внутри использует state-units (`TDisableableState`, `TFocusableState`) и пробрасывает
 * события наружу в формате `change:*`.
 */
export default class TInteractive<
	TProps extends IInteractiveProps = IInteractiveProps,
	TEvents extends TInteractiveEvents = TInteractiveEvents,
	TStates extends TInteractiveStatesOptions = TInteractiveStatesOptions,
> extends TPresentable<TProps, TEvents, TStates> {
	static defaultValues: Partial<IInteractiveProps> = {
		...TPresentable.defaultValues,
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

		const disabled = props.disabled ?? (TInteractive.defaultValues.disabled as boolean)
		const focused = props.focused ?? (TInteractive.defaultValues.focused as boolean)

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
