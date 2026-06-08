import TComponentView from '../../base/component-view'
import type {
	ILoader,
	ILoaderProps,
	TLoaderEvents,
	TLoaderIndicator,
} from './types'
import type { TComponentSize, TComponentVariant } from '../../common/types'

export class TLoader
	extends TComponentView<ILoaderProps, TLoaderEvents>
	implements ILoader
{
	static override baseClass = 's-loader'

	static defaultValues: Partial<ILoaderProps> = {
		...TComponentView.defaultValues,
		loader: 'spinner',
		size: 'normal',
		variant: 'normal',
		shouldDisable: true,
		shouldIndicator: true,
	}

	protected _loader!: TLoaderIndicator
	protected _size!: TComponentSize
	protected _variant!: TComponentVariant
	protected _shouldDisable!: boolean
	protected _shouldIndicator!: boolean

	constructor(
		options: Partial<ILoaderProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TLoader
		const { props = {} } = TComponentView.prepareOptions(options)

		this._loader = props.loader ?? ctor.defaultValues.loader!
		this._size = props.size ?? ctor.defaultValues.size!
		this._variant = props.variant ?? ctor.defaultValues.variant!
		this._shouldDisable = props.shouldDisable ?? ctor.defaultValues.shouldDisable!
		this._shouldIndicator = props.shouldIndicator ?? ctor.defaultValues.shouldIndicator!
	}

	get loader(): TLoaderIndicator {
		return this._loader
	}

	set loader(value: TLoaderIndicator) {
		if (this._loader !== value) {
			this._loader = value
			this.events.emit('change:loader', value)
		}
	}

	get size(): TComponentSize {
		return this._size
	}

	set size(value: TComponentSize) {
		if (this._size !== value) {
			this._size = value
			this.events.emit('change:size', value)
		}
	}

	get variant(): TComponentVariant {
		return this._variant
	}

	set variant(value: TComponentVariant) {
		if (this._variant !== value) {
			this._variant = value
			this.events.emit('change:variant', value)
		}
	}

	get shouldDisable(): boolean {
		return this._shouldDisable
	}

	set shouldDisable(value: boolean) {
		if (this._shouldDisable !== value) {
			this._shouldDisable = value
			this.events.emit('change:shouldDisable', value)
		}
	}

	get shouldIndicator(): boolean {
		return this._shouldIndicator
	}

	set shouldIndicator(value: boolean) {
		if (this._shouldIndicator !== value) {
			this._shouldIndicator = value
			this.events.emit('change:shouldIndicator', value)
		}
	}
}
