import { TObject, type TObjectProps } from '../object'
import type { IComponent, TComponentEventsMap, IComponentOptions } from './types'

export const defaultValues: Partial<IComponent> = {
	id: '',
	tag: 'div',
	visible: true,
	hidden: false,
}

export default class TComponent<TEvents extends TComponentEventsMap>
	extends TObject<TEvents>
	implements IComponent
{
	protected _id: string | number
	protected _visible: boolean
	protected _hidden: boolean

	protected _tag: string | Object

	// Base class name
	protected _baseClass: string
	// Array of dynamic CSS classes
	protected _classes: string[] = []

	constructor(options: IComponentOptions<IComponent>) {
		super()

		const { props = {}, baseClass } = options

		this._baseClass = baseClass ?? 's-component'

		this._id = props.id ?? defaultValues.id!
		this._tag = props.tag ?? defaultValues.tag!
		this._visible = typeof props.visible === 'boolean' ? props.visible : defaultValues.visible!
		this._hidden = typeof props.hidden === 'boolean' ? props.hidden : defaultValues.hidden!

		// Emit 'created' event after the current call stack is cleared
		setTimeout(() => this.emit('created', this), 0)
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

	get tag(): string | Object {
		return this._tag
	}

	set tag(value: string | Object) {
		if (this._tag !== value) {
			this._tag = value
		}
	}

	get classes(): string[] {
		return [this._baseClass, ...this._classes]
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			id: this._id,
			visible: this._visible,
			hidden: this._hidden,
		}
	}

	/**
	 * Показать компонент
	 */
	show(): void {
		if (!this.beforeShow()) {
			return
		}

		const canShow = this.emitWithResult('beforeShow')
		if (!canShow) {
			return
		}

		this._visible = true

		this.emit('show')
		this.emit('visible', true)

		this.afterShow()
	}

	/**
	 * Скрыть компонент
	 */
	hide(): void {
		if (!this.beforeHide()) {
			return
		}

		const canShow = this.emitWithResult('beforeHide')
		if (!canShow) {
			return
		}

		this._visible = false

		this.emit('hide')
		this.emit('visible', false)

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
