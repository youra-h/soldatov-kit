import { TStateUnit, type IStateUnit } from '../../common/state-unit'
import { TComponentView, type IComponentViewOptions } from '../component-view'
import { resolveState } from '../../common/resolve-state'
import type { IInteractiveProps, TInteractiveEvents, TInteractiveStatesOptions } from './types'
import { type TValuePayload } from '../../common/types'

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

		this._disableable = resolveState<IStateUnit<boolean>, boolean>({
			state: states?.disableable,
			ctor: TStateUnit,
			initial: disabled,
		})

		this._disableable.events.on('change', (payload: TValuePayload<boolean>) => {
			this.events.emit('change:disabled', payload.newValue)
		})

		this._focusable = resolveState<IStateUnit<boolean>, boolean>({
			state: states?.focusable,
			ctor: TStateUnit,
			initial: focused,
		})

		this._focusable.events.on('change', (payload: TValuePayload<boolean>) => {
			this.events.emit('change:focused', payload.newValue)
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
