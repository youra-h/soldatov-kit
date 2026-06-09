import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import type { ILoader, ILoaderProps, TLoaderEvents, TLoaderType } from './types'
import type { TComponentSize, TComponentVariant } from '../../common/types'
import { type ISpinner, TSpinner } from '../spinner'
import { type IIcon, TIcon } from '../icon'

export class TLoader extends TComponentView<ILoaderProps, TLoaderEvents> implements ILoader {
	static override baseClass = 's-loader'

	static defaultValues: Partial<ILoaderProps> = {
		...TComponentView.defaultValues,
		type: 'spinner',
		block: true,
		indicator: true,
	}

	protected _type!: TLoaderType
	protected _block: boolean
	protected _indicator: boolean
	private _loader?: ISpinner | IIcon

	constructor(options: IComponentViewOptions<ILoaderProps> | Partial<ILoaderProps> = {}) {
		super(options)

		const ctor = new.target as typeof TLoader

		const { props = {} } = TComponentView.prepareOptions(options)

		this._type = props.type ?? ctor.defaultValues.type!

		this._updateLoader()

		this._block = props.block ?? ctor.defaultValues.block!
		this._indicator = props.indicator ?? ctor.defaultValues.indicator!
	}

	get type(): TLoaderType {
		return this._type
	}

	/**
	 * Обновляет экземпляр индикатора в зависимости от текущего типа и состояния индикатора
	 */
	protected _updateLoader(): void {
		if (this._loader) {
			this._loader = undefined
		}

		if (this._indicator) {
			if (this._type === 'spinner') {
				this._loader = new TSpinner()
			} else if (this._type === 'icon') {
				this._loader = new TIcon()
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
		return this._loader?.size
	}

	set size(value: TComponentSize) {
		if (this._loader && this.size !== value) {
			this._loader.size = value
		}
	}

	get variant(): TComponentVariant | undefined {
		return this._loader instanceof TSpinner ? this._loader.variant : undefined
	}

	set variant(value: TComponentVariant) {
		if (!this._loader) return

		if (this._loader instanceof TSpinner && this.variant !== value) {
			this._loader.variant = value
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

	get loader(): ISpinner | IIcon | undefined {
		return this._loader
	}
}
