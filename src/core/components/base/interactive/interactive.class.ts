import { TStateUnit } from '../../../common'
import { TComponentView, type IComponentViewOptions } from '../component-view'
import type { IInteractiveProps, TInteractiveEvents, TInteractiveStates } from './types'
import type { TValuePayload } from '../../../bridge'
import { TEvented } from '../../../common'

/**
 * База для интерактивных компонентов: disabled + focused.
 *
 * Внутри использует value-based state-unit (`TStateUnit<boolean>`) и пробрасывает
 * события наружу в формате `change:*`.
 */
export default class TInteractive<
	TProps extends IInteractiveProps = IInteractiveProps,
	TEvents extends TInteractiveEvents = TInteractiveEvents,
	TStates extends TInteractiveStates = TInteractiveStates,
> extends TComponentView<TProps, TEvents, TStates> {
	static defaultValues: Partial<IInteractiveProps> = {
		...TComponentView.defaultValues,
		disabled: false,
		focused: false,
	}

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const ctor = new.target as typeof TInteractive

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		const disabled = props.disabled ?? (ctor.defaultValues.disabled as boolean)
		const focused = props.focused ?? (ctor.defaultValues.focused as boolean)

		this._states.disabled =
			states?.disabled ?? new TStateUnit<boolean>({ initial: disabled })

		this._states.disabled.events.on('change', (payload: TValuePayload<boolean>) => {
			;(this.events as TEvented<TInteractiveEvents>).emit('change:disabled', payload.newValue)
		})

		this._states.focused =
			states?.focused ?? new TStateUnit<boolean>({ initial: focused })

		this._states.focused.events.on('change', (payload: TValuePayload<boolean>) => {
			;(this.events as TEvented<TInteractiveEvents>).emit('change:focused', payload.newValue)
		})
	}

	get disabled(): boolean {
		return this._states.disabled.value
	}
	set disabled(value: boolean) {
		this._states.disabled.value = value
	}

	get focused(): boolean {
		return this._states.focused.value
	}
	set focused(value: boolean) {
		this._states.focused.value = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			disabled: this.disabled,
			focused: this.focused,
		} as TProps
	}
}
