import { TEntity } from '../entity'
import { TEvented } from '../../common/evented'
import type {
	IComponentModel,
	IComponentModelOptions,
	IComponentModelProps,
	TComponentModelEvents,
} from './types'

/**
 * Headless-модель компонента.
 *
 * Это тонкая основа для будущих слоёв (`TPresentable`, `TInteractive`, ...).
 * Хранит `id` и единый emitter `events`.
 */
export default class TComponentModel<
	TProps extends IComponentModelProps = IComponentModelProps,
	TEvents extends TComponentModelEvents = TComponentModelEvents,
>
	extends TEntity<TProps>
	implements IComponentModel<TProps, TEvents>
{
	static defaultValues: Partial<IComponentModelProps> = {
		id: '',
	}

	protected _id: string | number
	public readonly events: TEvented<TEvents>

	constructor(options: IComponentModelOptions<IComponentModelProps> = {}) {
		super()

		const { props = {} } = options

		this.events = new TEvented<TEvents>()
		this._id = props.id ?? TComponentModel.defaultValues.id!

		setTimeout(() => this.events.emit('created', this as any), 0)
	}

	static prepareOptions<T extends IComponentModelProps>(
		options: IComponentModelOptions<T> | Partial<T>,
	): IComponentModelOptions<T> {
		if (options && typeof options === 'object' && 'props' in options) return options
		return { props: options as Partial<T> }
	}

	static create<T extends TComponentModel>(
		this: new (options: any) => T,
		props: Partial<IComponentModelProps> = {},
	): T {
		return new this({ props })
	}

	get id(): string | number {
		return this._id
	}

	set id(value: string | number) {
		if (this._id === value) return
		this._id = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			id: this._id,
		} as TProps
	}
}
