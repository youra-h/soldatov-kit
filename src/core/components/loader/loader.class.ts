import { TComponentModel, type IComponentModelOptions } from '../../base/component-model'
import type {
	ILoader,
	ILoaderProps,
	TLoaderEvents,
	TLoaderType,
	TLoaderTypeIndicator,
} from './types'
import type { TComponentSize, TComponentVariant, TValuePayload } from '../../common/types'
import { resolveState } from '../../common/resolve-state'
import { type IStateUnit, TStateUnit } from '../../common/state-unit'
import { TSpinner } from '../spinner'
import { TIcon } from '../icon'

export class TLoader extends TComponentModel<ILoaderProps, TLoaderEvents> implements ILoader {
	static defaultValues: Partial<ILoaderProps> = {
		...TComponentModel.defaultValues,
		type: 'spinner',
		disabled: true,
		indicator: true,
		visible: true,
	}

	protected _type!: TLoaderType
	protected _disabled: boolean
	protected _indicator: boolean
	protected _visibleState: IStateUnit<boolean>
	private _ctrl?: TLoaderTypeIndicator

	constructor(options: IComponentModelOptions<ILoaderProps> | Partial<ILoaderProps> = {}) {
		super(options)

		const ctor = new.target as typeof TLoader

		const { props = {} } = TComponentModel.prepareOptions(options)

		this._type = props.type ?? ctor.defaultValues.type!

		this._disabled = props.disabled ?? ctor.defaultValues.disabled!
		this._indicator = props.indicator ?? ctor.defaultValues.indicator!

		this._updateLoader()

		this._visibleState = resolveState<IStateUnit<boolean>, boolean>({
			state: undefined,
			ctor: TStateUnit,
			initial: (props.visible ?? ctor.defaultValues.visible!) as boolean,
		})

		this._visibleState.events.on('change', (payload: TValuePayload<boolean>) => {
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
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled !== value) {
			this._disabled = value
			this.events.emit('change:disabled', value)
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
		return this._visibleState.value
	}

	set visible(value: boolean) {
		if (this._visibleState.value !== value) {
			this._visibleState.value = value
		}
	}

	get ctrl(): TLoaderTypeIndicator {
		return this._ctrl
	}

	getProps(): ILoaderProps {
		return {
			...super.getProps(),
			type: this._type,
			disabled: this._disabled,
			indicator: this._indicator,
			visible: this.visible,
		}
	}
}
