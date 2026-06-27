import { TComponent } from '../component'
import { TVisibilityState, type IVisibilityState } from '../../common/states'
import type {
	IComponentViewOptions,
	IComponentViewProps,
	TComponentViewEvents,
	TComponentViewStates,
} from './types'
import { type IStateUnit, TStateUnit } from '../../common/state-unit'
import { TClasses } from '../../common/classes'
import { type TValuePayload } from '../../common/types'
import { TEvented } from '../../common/evented'

/**
 * Web-component-view слой: tag/classes.
 *
 * Это слой, который удобен для UI-обёрток (Vue/React):
 * - `tag` (div/button/custom)
 * - `classes` (baseClass + динамические)
 */
export default class TComponentView<
	TProps extends IComponentViewProps = IComponentViewProps,
	TEvents extends TComponentViewEvents = TComponentViewEvents,
	TStates extends TComponentViewStates = TComponentViewStates,
> extends TComponent<TProps, TEvents, TStates> {
	/** Базовый CSS-класс по умолчанию (можно переопределить в наследниках). */
	static baseClass = 's-component-view'

	static defaultValues: Partial<IComponentViewProps> = {
		id: '',
		tag: 'div',
		rendered: true,
		visible: true,
	}

	protected _tag: string | object
	protected _classes: TClasses
	protected _ready: boolean = false

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		const ctor = new.target as typeof TComponentView

		const { props = {} as Partial<TProps>, states } = ctor.prepareOptions<TProps, TStates>(
			options,
		)

		super({ props })

		this._tag = props.tag ?? ctor.defaultValues.tag!

		// Инициализируем состояния видимости
		const rendered = props.rendered ?? (ctor.defaultValues.rendered as boolean)
		const visible = props.visible ?? (ctor.defaultValues.visible as boolean)

		this._states.rendered = states?.rendered ?? new TStateUnit<boolean>({ initial: rendered })
		this._states.visible = states?.visible ?? new TVisibilityState({ initial: visible })

		this._states.rendered.events.on('change', (payload: TValuePayload<boolean>) => {
			;(this.events as TEvented<TComponentViewEvents>).emit(
				'change:rendered',
				payload.newValue,
			)
			this._emitPresent()
		})
		this._states.visible.events.on('change', (payload: TValuePayload<boolean>) => {
			;(this.events as TEvented<TComponentViewEvents>).emit(
				'change:visible',
				payload.newValue,
			)
			this._emitPresent()
		})

		this._classes = new TClasses(ctor.baseClass)

		this._classes.events.on('change', () =>
			(this.events as TEvented<TComponentViewEvents>).emit(
				'change:classes',
				this._classes.toArray(),
			),
		)
	}

	get present(): boolean {
		return this.rendered && this.visible
	}

	private _emitPresent(): void {
		;(this.events as TEvented<TComponentViewEvents>).emit('change:present', this.present)
	}

	get classes(): TClasses {
		return this._classes
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

		const canShow = (this.events as TEvented<TComponentViewEvents>).emitWithResult('beforeShow')
		if (!canShow) return

		if (this.visible) return
		;(this._states.visible as IVisibilityState).show()
		;(this.events as TEvented<TComponentViewEvents>).emit('show')

		this.afterShow()
		;(this.events as TEvented<TComponentViewEvents>).emit('afterShow')
	}

	hide(): void {
		if (!this.beforeHide()) return

		const canHide = (this.events as TEvented<TComponentViewEvents>).emitWithResult('beforeHide')
		if (!canHide) return

		if (!this.visible) return
		;(this._states.visible as IVisibilityState).hide()
		;(this.events as TEvented<TComponentViewEvents>).emit('hide')

		this.afterHide()
		;(this.events as TEvented<TComponentViewEvents>).emit('afterHide')
	}

	protected beforeShow(): boolean {
		return true
	}

	protected afterShow(): void {}

	protected beforeHide(): boolean {
		return true
	}

	protected afterHide(): void {}

	get tag(): string | object {
		return this._tag
	}
	set tag(value: string | object) {
		if (this._tag === value) return

		this._tag = value
		;(this.events as TEvented<TComponentViewEvents>).emit('change:tag', value)
	}

	get ready(): boolean {
		return this._ready
	}
	set ready(value: boolean) {
		if (this._ready === value) return

		this._ready = value
		;(this.events as TEvented<TComponentViewEvents>).emit('change:ready', value)
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			tag: this._tag,
			rendered: this.rendered,
			visible: this.visible,
		} as TProps
	}
}
