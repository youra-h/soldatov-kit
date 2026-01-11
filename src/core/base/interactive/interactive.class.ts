import { TStateUnit, type IStateUnit } from '../state-unit'
import { TComponentView, type IComponentViewOptions } from '../component-view'
import { resolveState } from '../../common/resolve-state'
import type { IInteractiveProps, TInteractiveEvents, TInteractiveStatesOptions } from './types'

/**
 * База для интерактивных компонентов: disabled + focused.
 *
 * Внутри использует value-based state-unit (`TStateUnit<boolean>`) и пробрасывает
 * события наружу в формате `change:*`.
 */
export default class TInteractive<
	TProps extends IInteractiveProps = IInteractiveProps,
	TEvents extends TInteractiveEvents = TInteractiveEvents,
	TStates extends TInteractiveStatesOptions = TInteractiveStatesOptions,
> extends TComponentView<TProps, TEvents, TStates> {
	static defaultValues: Partial<IInteractiveProps> = {
		...TComponentView.defaultValues,
		disabled: false,
		focused: false,
	}

	protected _disableable: IStateUnit<boolean>
	protected _focusable: IStateUnit<boolean>

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		const disabled = props.disabled ?? (TInteractive.defaultValues.disabled as boolean)
		const focused = props.focused ?? (TInteractive.defaultValues.focused as boolean)

		this._disableable = resolveState<IStateUnit<boolean>, boolean>(
			states?.disableable,
			TStateUnit as unknown as new (initial: boolean) => IStateUnit<boolean>,
			disabled,
		)

		this._disableable.events.on('change', (value) => {
			this.events.emit('change:disabled' as any, value)
		})

		this._focusable = resolveState<IStateUnit<boolean>, boolean>(
			states?.focusable,
			TStateUnit as unknown as new (initial: boolean) => IStateUnit<boolean>,
			focused,
		)

		this._focusable.events.on('change', (value) => {
			this.events.emit('change:focused' as any, value)
		})
	}

	get disabled(): boolean {
		return this._disableable.value
	}
	set disabled(value: boolean) {
		this._disableable.value = value
	}

	get focused(): boolean {
		return this._focusable.value
	}
	set focused(value: boolean) {
		this._focusable.value = value
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
