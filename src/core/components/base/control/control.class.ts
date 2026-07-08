import { TStateUnit } from '../../../common'
import { TComponentView } from '../component-view'
import type { IComponentViewOptions } from '../component-view'
import { TStylable } from '../stylable'
import type { IControlProps, TControlEvents, TControlStates } from './types'
import { type TValuePayload } from '../../../bridge'
import { TEvented } from '../../../common'

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
	TStates extends TControlStates = TControlStates,
> extends TStylable<TProps, TEvents, TStates> {
	static defaultValues: Partial<IControlProps> = {
		...TStylable.defaultValues,
		disabled: false,
		focused: false,
	}

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const ctor = new.target as typeof TControl

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		const disabled = props.disabled ?? (ctor.defaultValues.disabled as boolean)
		const focused = props.focused ?? (ctor.defaultValues.focused as boolean)

		this._states.disabled =
			states?.disabled ?? new TStateUnit<boolean>({ initial: disabled })

		this._states.disabled.events.on('change', (payload: TValuePayload<boolean>) => {
			;(this.events as TEvented<TControlEvents>).emit('change:disabled', payload.newValue)
		})

		this._states.focused =
			states?.focused ?? new TStateUnit<boolean>({ initial: focused })

		this._states.focused.events.on('change', (payload: TValuePayload<boolean>) => {
			;(this.events as TEvented<TControlEvents>).emit('change:focused', payload.newValue)
		})
	}

	get disabled(): boolean {
		return this._states.disabled.value
	}
	set disabled(value: boolean) {
		if (this._states.disabled.value !== value) {
			this._states.disabled.value = value
		}
	}

	get focused(): boolean {
		return this._states.focused.value
	}
	set focused(value: boolean) {
		if (this._states.focused.value !== value) {
			this._states.focused.value = value
		}
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			disabled: this.disabled,
			focused: this.focused,
		} as TProps
	}
}
