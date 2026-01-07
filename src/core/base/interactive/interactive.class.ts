import { TDisableableState, TFocusableState } from '../states'
import { TPresentable } from '../presentable'
import type { IPresentableOptions } from '../presentable'
import type { IInteractiveProps, TInteractiveEvents } from './types'

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

	protected _disableable: TDisableableState
	protected _focusable: TFocusableState

	constructor(options: IPresentableOptions<TProps> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps> } = TPresentable.prepareOptions<TProps>(
			options as any,
		)

		this._disableable = new TDisableableState(
			props.disabled ?? (TInteractive.defaultValues.disabled as boolean),
		)

		this._disableable.events.on('change', (value) => {
			this.events.emit('change:disabled' as any, value)
		})

		this._focusable = new TFocusableState(
			props.focused ?? (TInteractive.defaultValues.focused as boolean),
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
