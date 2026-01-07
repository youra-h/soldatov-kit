import { TComponentModel } from '../component-model'
import type { IComponentModelOptions, IComponentModelProps } from '../component-model'
import { TVisibilityState } from '../states'
import type { IVisibilityState } from '../states'
import type {
	IPresentableOptions,
	IPresentableProps,
	TPresentablePreparedOptions,
	TPresentableEvents,
} from './types'

/**
 * Web-presentable слой: tag/classes/attrs.
 *
 * Это слой, который удобен для UI-обёрток (Vue/React):
 * - `tag` (div/button/custom)
 * - `classes` (baseClass + динамические)
 * - `attrs` (произвольные атрибуты)
 */
export default class TPresentable<
	TProps extends IPresentableProps = IPresentableProps,
	TEvents extends TPresentableEvents = TPresentableEvents,
> extends TComponentModel<TProps, TEvents> {
	/** Базовый CSS-класс по умолчанию (можно переопределить в наследниках). */
	static baseClass = 's-presentable'

	static defaultValues: Partial<IPresentableProps> = {
		id: '',
		tag: 'div',
		rendered: true,
		visible: true,
		classes: [],
		attrs: {},
	}

	protected _tag: string | object
	protected _renderedState: IVisibilityState
	protected _visibilityState: IVisibilityState
	protected _baseClass: string
	protected _classes: string[]
	protected _attrs: Record<string, unknown>

	static prepareOptions<TP extends IPresentableProps>(
		options: IPresentableOptions<TP> | Partial<TP>,
		defaultBaseClass?: string,
	): TPresentablePreparedOptions<TP>

	static prepareOptions<T extends IComponentModelProps>(
		options: IComponentModelOptions<T> | Partial<T>,
		defaultBaseClass?: string,
	): IComponentModelOptions<T> & { baseClass: string }

	static override prepareOptions<T extends IComponentModelProps>(
		options: IComponentModelOptions<T> | Partial<T> = {},
		defaultBaseClass?: string,
	) {
		if (options && typeof options === 'object') {
			const normalized = options as IComponentModelOptions<T> & {
				baseClass?: string
				states?: unknown
			}

			if ('props' in options) {
				return {
					...normalized,
					baseClass:
						normalized.baseClass ??
						defaultBaseClass ??
						(this as typeof TPresentable).baseClass,
				}
			}

			if ('baseClass' in options) {
				return {
					props: {} as Partial<T>,
					baseClass: normalized.baseClass,
				}
			}

			if ('states' in options) {
				return {
					props: {} as Partial<T>,
					...normalized,
					baseClass: defaultBaseClass ?? (this as typeof TPresentable).baseClass,
				}
			}
		}

		return {
			props: options as Partial<T>,
			baseClass: defaultBaseClass ?? (this as typeof TPresentable).baseClass,
		}
	}

	constructor(options: IPresentableOptions<TProps> | Partial<TProps> = {}) {
		const ctor = new.target as typeof TPresentable
		const { props = {} as Partial<TProps>, baseClass, states } = ctor.prepareOptions<TProps>(options)

		super({ props })

		this._tag = props.tag ?? TPresentable.defaultValues.tag!

		const initialRendered =
			typeof props.rendered === 'boolean'
				? props.rendered
				: (TPresentable.defaultValues.rendered as boolean)
		const initialVisible =
			typeof props.visible === 'boolean'
				? props.visible
				: (TPresentable.defaultValues.visible as boolean)

		const stateFactory = states?.factory
		const RenderedStateCtor = states?.rendered ?? TVisibilityState
		const VisibilityStateCtor = states?.visible ?? TVisibilityState

		this._renderedState = stateFactory
			? stateFactory('rendered', initialRendered)
			: new RenderedStateCtor(initialRendered)
		this._renderedState.events.on('change', (value) => {
			this.events.emit('change:rendered', value)
		})

		this._visibilityState = stateFactory
			? stateFactory('visible', initialVisible)
			: new VisibilityStateCtor(initialVisible)
		this._visibilityState.events.on('change', (value) => {
			this.events.emit('change:visible', value)
		})

		this._baseClass = baseClass
		this._classes = (props.classes ?? TPresentable.defaultValues.classes!) as string[]
		this._attrs = (props.attrs ?? TPresentable.defaultValues.attrs!) as Record<string, unknown>
	}

	get rendered(): boolean {
		return this._renderedState.visible
	}
	set rendered(value: boolean) {
		if (value === this._renderedState.visible) return
		if (value) {
			this._renderedState.show()
		} else {
			this._renderedState.hide()
		}
	}

	get visible(): boolean {
		return this._visibilityState.visible
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

		const canShow = this.events.emitWithResult('beforeShow' as any)
		if (!canShow) return

		if (this.visible) return
		this._visibilityState.show()

		this.events.emit('show' as any)

		this.afterShow()
		this.events.emit('afterShow' as any)
	}

	hide(): void {
		if (!this.beforeHide()) return

		const canHide = this.events.emitWithResult('beforeHide' as any)
		if (!canHide) return

		if (!this.visible) return
		this._visibilityState.hide()

		this.events.emit('hide' as any)

		this.afterHide()
		this.events.emit('afterHide' as any)
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

		this.events.emit('change:tag' as any, value)
	}

	get attrs(): Record<string, unknown> {
		return this._attrs
	}
	set attrs(value: Record<string, unknown>) {
		if (this._attrs === value) return

		this._attrs = value

		this.events.emit('change:attrs' as any, value)
	}

	get classes(): string[] {
		return [this._baseClass, ...this._classes]
	}

	setClasses(value: string[]): void {
		if (this._classes === value) return

		this._classes = value

		this.events.emit('change:classes' as any, value)
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			tag: this._tag,
			rendered: this.rendered,
			visible: this.visible,
			baseClass: this._baseClass,
			classes: this._classes,
			attrs: this._attrs,
		} as TProps
	}
}
