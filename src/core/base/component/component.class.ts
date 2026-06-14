import { TEntity } from '../entity'
import { TEvented } from '../../common/evented'
import type { IStateUnit } from '../../common/state-unit'
import type {
	IComponent,
	IComponentOptions,
	IComponentProps,
	TComponentEvents,
} from './types'

/**
 * Headless-модель компонента.
 *
 * Это тонкая основа для будущих слоёв (`TComponentView`, `TInteractive`, ...).
 * Хранит `id` и единый emitter `events`.
 */
export default class TComponent<
	TProps extends IComponentProps = IComponentProps,
	TEvents extends TComponentEvents = TComponentEvents,
	TStates extends Record<string, IStateUnit<any>> = Record<string, IStateUnit<any>>,
>
	extends TEntity<TProps>
	implements IComponent<TProps, TEvents, TStates>
{
	static defaultValues: Partial<IComponentProps> = {
		id: '',
	}

	protected _id: string | number
	protected _states = {} as TStates
	public readonly events: TEvented<TEvents>

	constructor(options: IComponentOptions<TProps, TStates> | Partial<TProps> = {}) {
		const ctor = new.target as typeof TComponent

		const { props = {} as Partial<TProps> } = ctor.prepareOptions<TProps, TStates>(options)
		super()

		this.events = new TEvented<TEvents>()
		this._id = props.id ?? ctor.defaultValues.id!

		setTimeout(() => (this.events as TEvented<TComponentEvents>).emit('created', this), 0)
	}

	static prepareOptions<
		TProps extends IComponentProps = IComponentProps,
		TStates = any,
	>(
		options: IComponentOptions<TProps, TStates> | Partial<TProps>,
	): { props: Partial<TProps>; states?: Partial<TStates> } {
		const raw = options as Record<string, unknown>
		const hasPropsKey = Object.prototype.hasOwnProperty.call(raw, 'props')
		const hasStatesKey = Object.prototype.hasOwnProperty.call(raw, 'states')
		const hasRenderConfigKey = Object.prototype.hasOwnProperty.call(raw, 'renderConfig')

		// Если есть props/states/renderConfig — это точно options-объект
		const isOptionsObject = hasPropsKey || hasStatesKey || hasRenderConfigKey

		if (isOptionsObject) {
			const opt = options as IComponentOptions<TProps, TStates>
			const props = (opt.props ?? {}) as Partial<TProps>

			return {
				props,
				states: opt.states,
			}
		}

		// Иначе это plain props
		const props = options as Partial<TProps>

		return {
			props,
		}
	}

	/**
	 * Создает экземпляр компонента с заданными props.
	 * @param props Начальные свойства компонента (могут включать специфичные поля дочерних классов)
	 * @returns Экземпляр компонента
	 * @example
	 * TIcon.create({ tag: 'icon.svg', size: 'lg' })
	 * TButton.create({ text: 'Click me', variant: 'accent' })
	 */
	/**
	 * Создает экземпляр компонента с заданными props.
	 * @param props Начальные свойства компонента (могут включать специфичные поля дочерних классов)
	 * @returns Экземпляр компонента
	 * @example
	 * TIcon.create({ tag: 'icon.svg', size: 'lg' })
	 * TButton.create({ text: 'Click me', variant: 'accent' })
	 */
	static create<T extends TComponent>(
		this: new (options: any) => T,
		props?: Partial<T extends TComponent<infer P> ? P : IComponentProps>,
	): T {
		return new this({ props: props ?? {} })
	}

	get states(): TStates {
		return this._states
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
