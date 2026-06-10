import { TStateUnit, type IStateUnit } from '../../common/state-unit'
import { TComponentView } from '../component-view'
import type { IComponentViewOptions } from '../component-view'
import { TStylable } from '../stylable'
import { resolveState } from '../../common/resolve-state'
import type { IControlProps, TControlEvents, TControlStatesOptions } from './types'
import { type TValuePayload } from '../../common/types'
import { TEvented } from '../../common/evented'

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

	protected _disableState: IStateUnit<boolean>
	protected _focusedState: IStateUnit<boolean>

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const ctor = new.target as typeof TControl

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		const disabled = props.disabled ?? (ctor.defaultValues.disabled as boolean)
		const focused = props.focused ?? (ctor.defaultValues.focused as boolean)

		this._disableState = resolveState<IStateUnit<boolean>, boolean>({
			state: states?.disableState,
			ctor: TStateUnit,
			initial: disabled,
		})

		this._disableState.events.on('change', (payload: TValuePayload<boolean>) => {
			;(this.events as TEvented<TControlEvents>).emit('change:disabled', payload.newValue)
		})

		this._focusedState = resolveState<IStateUnit<boolean>, boolean>({
			state: states?.focusedState,
			ctor: TStateUnit,
			initial: focused,
		})

		this._focusedState.events.on('change', (payload: TValuePayload<boolean>) => {
			;(this.events as TEvented<TControlEvents>).emit('change:focused', payload.newValue)
		})
	}

	get disabled(): boolean {
		return this._disableState.value
	}
	set disabled(value: boolean) {
		if (this._disableState.value !== value) {
			this._disableState.value = value
		}
	}

	get focused(): boolean {
		return this._focusedState.value
	}
	set focused(value: boolean) {
		if (this._focusedState.value !== value) {
			this._focusedState.value = value
		}
	}

	click(event?: Event): void {
		;(this.events as TEvented<TControlEvents>).emit('click' as any, event)
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			disabled: this.disabled,
			focused: this.focused,
		} as TProps
	}
}
