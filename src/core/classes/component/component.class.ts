import { TEntity } from '../entity'
import { TEvented } from '../../common/evented'
import type { IComponent, IComponentProps, IComponentOptions, TComponentEvents } from './types'

/**
 * Базовый класс для всех UI-компонентов.
 * Использует композицию для событий (events).
 */
export default class TComponent<
		TProps extends IComponentProps = IComponentProps,
		TEvents extends TComponentEvents = TComponentEvents,
	>
	extends TEntity<TProps>
	implements IComponent
{
	static defaultValues: Partial<IComponentProps> = {
		id: '',
		tag: 'div',
		visible: true,
		hidden: false,
	}

	protected _id: string | number
	protected _visible: boolean
	protected _hidden: boolean

	protected _tag: string | Entity

	// Base class name
	protected _baseClass: string
	// Array of dynamic CSS classes
	protected _classes: string[] = []
	// События
	public readonly events: TEvented<TEvents>

	constructor(options: IComponentOptions<IComponentProps> = {}) {
		super()

		const { props = {}, baseClass } = options

		this._baseClass = baseClass ?? 's-component'

		this.events = new TEvented<TEvents>()

		this._id = props.id ?? TComponent.defaultValues.id!
		this._tag = props.tag ?? TComponent.defaultValues.tag!
		this._visible =
			typeof props.visible === 'boolean' ? props.visible : TComponent.defaultValues.visible!
		this._hidden =
			typeof props.hidden === 'boolean' ? props.hidden : TComponent.defaultValues.hidden!

		// Emit 'created' event after the current call stack is cleared
		setTimeout(() => this.events.emit('created', this), 0)
	}

	static prepareOptions<T>(
		options: IComponentOptions<T> | Partial<T>,
		defaultBaseClass: string,
	): IComponentOptions<T> {
		if (options && 'props' in options) {
			return { ...options, baseClass: options.baseClass ?? defaultBaseClass }
		}
		return { props: options as Partial<T>, baseClass: defaultBaseClass }
	}

	get id(): string | number {
		return this._id
	}

	set id(value: string | number) {
		if (this._id !== value) {
			this._id = value
		}
	}

	get visible(): boolean {
		return this._visible
	}

	set visible(value: boolean) {
		if (value) {
			this.show()
		} else {
			this.hide()
		}
	}

	get hidden(): boolean {
		return this._hidden
	}

	set hidden(value: boolean) {
		if (this._hidden !== value) {
			this._hidden = value
		}
	}

	get tag(): string | Entity {
		return this._tag
	}

	set tag(value: string | Entity) {
		if (this._tag !== value) {
			this._tag = value
		}
	}

	get classes(): string[] {
		return [this._baseClass, ...this._classes]
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			id: this._id,
			visible: this._visible,
			hidden: this._hidden,
			tag: this._tag,
		}
	}

	/**
	 * Показать компонент
	 */
	show(): void {
		if (!this.beforeShow()) {
			return
		}

		const canShow = this.events.emitWithResult('beforeShow')
		if (!canShow) {
			return
		}

		this._visible = true

		this.events.emit('show')
		this.events.emit('visible', true)

		this.afterShow()
	}

	/**
	 * Скрыть компонент
	 */
	hide(): void {
		if (!this.beforeHide()) {
			return
		}

		const canShow = this.events.emitWithResult('beforeHide')
		if (!canShow) {
			return
		}

		this._visible = false

		this.events.emit('hide')
		this.events.emit('visible', false)

		this.afterHide()
	}

	beforeShow(): boolean {
		return true
	}

	afterShow(): void {}

	beforeHide(): boolean {
		return true
	}

	afterHide(): void {}

	/**
	 * Фабричный метод для создания компонента.
	 */
	static create<T extends TComponent>(
		this: new (options: any) => T,
		props: Partial<IComponentProps> = {},
	): T {
		return new this({ props })
	}

	/**
	 * Компонент скрыт и удален из Dom
	 */
	get isHidden(): boolean {
		return this._hidden ? this._visible : true
	}

	/**
	 * Компонент видим и не удален из Dom
	 */
	get isVisibility(): boolean {
		return this._hidden ? true : this._visible
	}
}
