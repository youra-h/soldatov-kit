import { TComponentModel, type IComponentModelOptions } from '../../base/component-model'
import type {
	ILoader,
	ILoaderProps,
	TLoaderEvents,
	TLoaderStatesOptions,
	TLoaderType,
	TLoaderTypeIndicator,
} from './types'
import type { TComponentSize, TComponentVariant, TValuePayload } from '../../common/types'
import { TStateUnit } from '../../common/state-unit'
import { TSpinner } from '../spinner'
import { TIcon } from '../icon'

export class TLoader<TStates extends TLoaderStatesOptions = TLoaderStatesOptions>
	extends TComponentModel<ILoaderProps, TLoaderEvents>
	implements ILoader
{
	static defaultValues: Partial<ILoaderProps> = {
		...TComponentModel.defaultValues,
		type: 'spinner',
		disabled: true,
		indicator: true,
		visible: true,
	}

	protected _type!: TLoaderType
	protected _indicator: boolean
	private _ctrl?: TLoaderTypeIndicator

	constructor(
		options: IComponentModelOptions<ILoaderProps, TStates> | Partial<ILoaderProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TLoader

		const { props = {}, states } = TComponentModel.prepareOptions<ILoaderProps, TStates>(
			options,
		)

		this._type = props.type ?? ctor.defaultValues.type!

		const disabled = props.disabled ?? ctor.defaultValues.disabled!
		this._indicator = props.indicator ?? ctor.defaultValues.indicator!

		this._updateLoader()

		this._states.disabled =
			states?.disabled ?? new TStateUnit<boolean>({ initial: disabled })

		this._states.disabled.events.on('change', (payload: TValuePayload<boolean>) => {
			this.events.emit('change:disabled', payload.newValue)
		})

		this._states.visible =
			states?.visible ??
			new TStateUnit<boolean>({
				initial: (props.visible ?? ctor.defaultValues.visible!) as boolean,
			})

		this._states.visible.events.on('change', (payload: TValuePayload<boolean>) => {
			this.events.emit('change:visible', payload.newValue)
		})
	}

	get type(): TLoaderType {
		return this._type
	}

	/**
	 * Обновляет экземпляр индикатора в зависимости от текущего типа и состояния индикатора
	 */
	protected _updateLoader(): void {
		if (this._ctrl) {
			this._ctrl = undefined
		}

		if (this._indicator) {
			if (this._type === 'spinner') {
				this._ctrl = new TSpinner()
			} else if (this._type === 'icon') {
				this._ctrl = new TIcon()
			}
		}
	}

	set type(value: TLoaderType) {
		if (this._type !== value) {
			this._type = value

			this._updateLoader()

			this.events.emit('change:type', value)
		}
	}

	get size(): TComponentSize | undefined {
		return this._ctrl?.size
	}

	set size(value: TComponentSize) {
		if (this._ctrl && this.size !== value) {
			this._ctrl.size = value
		}
	}

	get variant(): TComponentVariant | undefined {
		return this._ctrl instanceof TSpinner ? this._ctrl.variant : undefined
	}

	set variant(value: TComponentVariant) {
		if (!this._ctrl) return

		if (this._ctrl instanceof TSpinner && this.variant !== value) {
			this._ctrl.variant = value
		}
	}

	get disabled(): boolean {
		return this._states.disabled.value
	}

	set disabled(value: boolean) {
		if (this._states.disabled.value !== value) {
			this._states.disabled.value = value
		}
	}

	get indicator(): boolean {
		return this._indicator
	}

	set indicator(value: boolean) {
		if (this._indicator !== value) {
			this._indicator = value

			this._updateLoader()

			this.events.emit('change:indicator', value)
		}
	}

	get visible(): boolean {
		return this._states.visible.value
	}

	set visible(value: boolean) {
		if (this._states.visible.value !== value) {
			this._states.visible.value = value
		}
	}

	get ctrl(): TLoaderTypeIndicator {
		return this._ctrl
	}

	getProps(): ILoaderProps {
		return {
			...super.getProps(),
			type: this._type,
			disabled: this.disabled,
			indicator: this._indicator,
			visible: this.visible,
		}
	}
}
