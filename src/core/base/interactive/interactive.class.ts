import { TDisableableState, TFocusableState } from '../states'
import type { IDisableableState, IFocusableState } from '../states'
import { TPresentable } from '../presentable'
import type { IInteractiveOptions, IInteractiveProps, TInteractiveEvents } from './types'

/**
 * База для интерактивных компонентов: disabled + focused.
 *
 * Внутри использует state-units (`TDisableableState`, `TFocusableState`) и пробрасывает
 * события наружу в формате `change:*`.
 */
export default class TInteractive<
	TProps extends IInteractiveProps = IInteractiveProps,
	TEvents extends TInteractiveEvents = TInteractiveEvents,
> extends TPresentable<TProps, TEvents> {
	static defaultValues: Partial<IInteractiveProps> = {
		...TPresentable.defaultValues,
		disabled: false,
		focused: false,
	}

	protected _disableable: IDisableableState
	protected _focusable: IFocusableState

	constructor(options: IInteractiveOptions<TProps> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TPresentable.prepareOptions<TProps>(
			options as any,
		) as unknown as { props: Partial<TProps>; states?: IInteractiveOptions<TProps>['states'] }

		const initialDisabled = props.disabled ?? (TInteractive.defaultValues.disabled as boolean)
		const initialFocused = props.focused ?? (TInteractive.defaultValues.focused as boolean)

		const DisableableCtor = states?.disableable ?? TDisableableState
		const FocusableCtor = states?.focusable ?? TFocusableState

		this._disableable = new DisableableCtor(initialDisabled)

		this._disableable.events.on('change', (value) => {
			this.events.emit('change:disabled' as any, value)
		})

		this._focusable = new FocusableCtor(initialFocused)

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
