import { TStateUnit, type IStateUnit } from '../../common/state-unit'
import { TComponentView } from '../component-view'
import type { IComponentViewOptions } from '../component-view'
import { TStylable } from '../stylable'
import { resolveState } from '../../common/resolve-state'
import type { IControlProps, TControlEvents, TControlStatesOptions } from './types'
import { type TValuePayload } from '../../common/types'

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

	protected _disableable: IStateUnit<boolean>
	protected _focusable: IStateUnit<boolean>

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		const disabled = props.disabled ?? (TControl.defaultValues.disabled as boolean)
		const focused = props.focused ?? (TControl.defaultValues.focused as boolean)

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

	click(event?: Event): void {
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
