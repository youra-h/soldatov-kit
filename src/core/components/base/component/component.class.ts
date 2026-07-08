import { TEntity } from '../entity'
import { TEvented } from '../../../common'
import { type IStateUnit, TStateUnit } from '../../../common'
import { TVisibilityState, type IVisibilityState } from '../../../common'
import type { TValuePayload } from '../../../bridge'
import type {
	IComponent,
	IComponentOptions,
	IComponentProps,
	TComponentEvents,
	TComponentStates,
} from './types'

/**
 * Headless-модель компонента.
 *
 * База для всех компонентов. Хранит `id`, `events`, `visible`, `rendered`.
 */
export default class TComponent<
	TProps extends IComponentProps = IComponentProps,
	TEvents extends TComponentEvents = TComponentEvents,
	TStates extends TComponentStates = TComponentStates,
>
	extends TEntity<TProps>
	implements IComponent<TProps, TEvents, TStates>
{
	static defaultValues: Partial<IComponentProps> = {
		id: '',
		rendered: true,
		visible: true,
	}

	protected _id: string | number
	protected _states = {} as TStates
	public readonly events: TEvented<TEvents>

	constructor(options: IComponentOptions<TProps, TStates> | Partial<TProps> = {}) {
		const ctor = new.target as typeof TComponent

		const { props = {} as Partial<TProps>, states } = ctor.prepareOptions<TProps, TStates>(options)
		super()

		this.events = new TEvented<TEvents>()
		this._id = props.id ?? ctor.defaultValues.id!

		// Инициализируем состояния видимости
		const rendered = props.rendered ?? (ctor.defaultValues.rendered as boolean)
		const visible = props.visible ?? (ctor.defaultValues.visible as boolean)

		this._states.rendered = states?.rendered ?? new TStateUnit<boolean>({ initial: rendered }) as TStates['rendered']
		this._states.visible = states?.visible ?? new TVisibilityState({ initial: visible }) as TStates['visible']

		this._states.rendered.events.on('change', (payload: TValuePayload<boolean>) => {
			; (this.events as TEvented<TComponentEvents>).emit('change:rendered', payload.newValue)
			this._emitPresent()
		})
		this._states.visible.events.on('change', (payload: TValuePayload<boolean>) => {
			; (this.events as TEvented<TComponentEvents>).emit('change:visible', payload.newValue)
			this._emitPresent()
		})

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

	get present(): boolean {
		return this.rendered && this.visible
	}

	private _emitPresent(): void {
		; (this.events as TEvented<TComponentEvents>).emit('change:present', this.present)
	}

	get rendered(): boolean {
		return this._states.rendered.value
	}
	set rendered(value: boolean) {
		if (value === this._states.rendered.value) return
		this._states.rendered.value = value
	}

	get visible(): boolean {
		return this._states.visible.value
	}
	set visible(value: boolean) {
		if (value) {
			this.show()
		} else {
			this.hide()
		}
	}

	show(): void {
		if (!this.beforeShow()) return

		const canShow = (this.events as TEvented<TComponentEvents>).emitWithResult('beforeShow')
		if (!canShow) return

		if (this.visible) return
			; (this._states.visible as IVisibilityState).show()
			; (this.events as TEvented<TComponentEvents>).emit('show')

		this.afterShow()
			; (this.events as TEvented<TComponentEvents>).emit('afterShow')
	}

	hide(): void {
		if (!this.visible) return

		if (!this.beforeHide()) return

		const canHide = (this.events as TEvented<TComponentEvents>).emitWithResult('beforeHide')
		if (!canHide) return

			; (this._states.visible as IVisibilityState).hide()
			; (this.events as TEvented<TComponentEvents>).emit('hide')

		this.afterHide()
			; (this.events as TEvented<TComponentEvents>).emit('afterHide')
	}

	protected beforeShow(): boolean {
		return true
	}

	protected afterShow(): void { }

	protected beforeHide(): boolean {
		return true
	}

	protected afterHide(): void { }

	getProps(): TProps {
		return {
			...super.getProps(),
			id: this._id,
			rendered: this.rendered,
			visible: this.visible,
		} as TProps
	}
}
