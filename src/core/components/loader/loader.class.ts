import { TComponentModel, type IComponentModelOptions } from '../../base/component-model'
import type {
	ILoader,
	ILoaderProps,
	TLoaderEvents,
	TLoaderType,
	TLoaderTypeIndicator,
} from './types'
import type { TComponentSize, TComponentVariant } from '../../common/types'
import { TSpinner } from '../spinner'
import { TIcon } from '../icon'

export class TLoader extends TComponentModel<ILoaderProps, TLoaderEvents> implements ILoader {
	static defaultValues: Partial<ILoaderProps> = {
		...TComponentModel.defaultValues,
		type: 'spinner',
		block: true,
		indicator: true,
		visible: true,
	}

	protected _type!: TLoaderType
	protected _block: boolean
	protected _indicator: boolean
	protected _visible: boolean
	private _ctrl?: TLoaderTypeIndicator

	constructor(options: IComponentModelOptions<ILoaderProps> | Partial<ILoaderProps> = {}) {
		super(options)

		const ctor = new.target as typeof TLoader

		const { props = {} } = TComponentModel.prepareOptions(options)

		this._type = props.type ?? ctor.defaultValues.type!

		this._updateLoader()

		this._block = props.block ?? ctor.defaultValues.block!
		this._indicator = props.indicator ?? ctor.defaultValues.indicator!
		this._visible = props.visible ?? ctor.defaultValues.visible!
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

	get block(): boolean {
		return this._block
	}

	set block(value: boolean) {
		if (this._block !== value) {
			this._block = value
			this.events.emit('change:block', value)
		}
	}

	get indicator(): boolean {
		return this._indicator
	}

	set indicator(value: boolean) {
		if (this._indicator !== value) {
			this._indicator = value

			if (this._indicator) {
				this._updateLoader()
			}

			this.events.emit('change:indicator', value)
		}
	}

	get visible(): boolean {
		return this._visible
	}

	set visible(value: boolean) {
		if (this._visible !== value) {
			this._visible = value

			this.events.emit('change:visible', value)
		}
	}

	get ctrl(): TLoaderTypeIndicator {
		return this._ctrl
	}
}
