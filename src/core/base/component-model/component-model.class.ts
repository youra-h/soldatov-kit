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
 * Это тонкая основа для будущих слоёв (`TComponentView`, `TInteractive`, ...).
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

	constructor(options: IComponentModelOptions<TProps> | Partial<TProps> = {}) {
		const ctor = new.target as typeof TComponentModel
		const { props = {} as Partial<TProps> } = ctor.prepareOptions<TProps>(options)
		super()

		this.events = new TEvented<TEvents>()
		this._id = props.id ?? TComponentModel.defaultValues.id!

		setTimeout(() => this.events.emit('created', this as any), 0)
	}

	static prepareOptions<TProps extends IComponentModelProps>(
		options: IComponentModelOptions<TProps> | Partial<TProps>,
	): IComponentModelOptions<TProps> {
		if (options && typeof options === 'object' && 'props' in options) return options
		return { props: options as Partial<TProps> }
	}

	/**
	 * Создает экземпляр компонента с заданными props.
	 * @param props Начальные свойства компонента (могут включать специфичные поля дочерних классов)
	 * @returns Экземпляр компонента
	 * @example
	 * TIcon.create({ tag: 'icon.svg', size: 'lg' })
	 * TButton.create({ text: 'Click me', variant: 'primary' })
	 */
	/**
	 * Создает экземпляр компонента с заданными props.
	 * @param props Начальные свойства компонента (могут включать специфичные поля дочерних классов)
	 * @returns Экземпляр компонента
	 * @example
	 * TIcon.create({ tag: 'icon.svg', size: 'lg' })
	 * TButton.create({ text: 'Click me', variant: 'primary' })
	 */
	static create<T extends TComponentModel>(
		this: new (options: any) => T,
		props?: Partial<T extends TComponentModel<infer P> ? P : IComponentModelProps>,
	): T {
		return new this({ props: props ?? {} })
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
