import TComponentView, { type IComponentViewOptions } from '../../base/component-view'
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
	}

	protected _loader!: TLoaderIndicator
	protected _size!: TComponentSize
	protected _variant!: TComponentVariant

	constructor(
		options:
			| IComponentViewOptions<ILoaderProps>
			| Partial<ILoaderProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TLoader
		const { props = {} } = TComponentView.prepareOptions<ILoaderProps>(options)

		this._loader = props.loader ?? ctor.defaultValues.loader!
		this._size = props.size ?? ctor.defaultValues.size!
		this._variant = props.variant ?? ctor.defaultValues.variant!
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
}
