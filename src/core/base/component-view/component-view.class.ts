import { TComponentModel } from '../component-model'
import { TVisibilityState } from '../states'
import type { IVisibilityState } from '../states'
import { resolveState } from '../../common/resolve-state'
import type {
	IComponentViewOptions,
	IComponentViewProps,
	TComponentViewPreparedOptions,
	TComponentViewEvents,
	TComponentViewStatesOptions,
} from './types'
import { type IStateUnit, TStateUnit } from '../state-unit'

/**
 * Web-component-view слой: tag/classes/attrs.
 *
 * Это слой, который удобен для UI-обёрток (Vue/React):
 * - `tag` (div/button/custom)
 * - `classes` (baseClass + динамические)
 * - `attrs` (произвольные атрибуты)
 */
export default class TComponentView<
	TProps extends IComponentViewProps = IComponentViewProps,
	TEvents extends TComponentViewEvents = TComponentViewEvents,
	TStates extends TComponentViewStatesOptions = TComponentViewStatesOptions,
> extends TComponentModel<TProps, TEvents> {
	/** Базовый CSS-класс по умолчанию (можно переопределить в наследниках). */
	static baseClass = 's-component-view'

	static defaultValues: Partial<IComponentViewProps> = {
		id: '',
		tag: 'div',
		rendered: true,
		visible: true,
		classes: [],
		attrs: {},
	}

	protected _tag: string | object
	protected _renderedState: IStateUnit<boolean>
	protected _visibilityState: IVisibilityState
	protected _baseClass: string
	protected _classes: string[]
	protected _attrs: Record<string, unknown>

	static prepareOptions<
		TProps extends IComponentViewProps = IComponentViewProps,
		TStates extends TComponentViewStatesOptions = TComponentViewStatesOptions,
	>(
		options: IComponentViewOptions<TProps, TStates> | Partial<TProps>,
	): TComponentViewPreparedOptions<TProps, TStates> {
		const defaultBaseClass = (this as typeof TComponentView).baseClass

		const raw = options as Record<string, unknown>
		const hasPropsKey = Object.prototype.hasOwnProperty.call(raw, 'props')
		const hasStatesKey = Object.prototype.hasOwnProperty.call(raw, 'states')
		const hasBaseClassKey = Object.prototype.hasOwnProperty.call(raw, 'baseClass')

		// { baseClass: '...' } — считаем это "опциями", а не props
		const isOnlyBaseClass =
			hasBaseClassKey && Object.keys(raw).length === 1 && Object.keys(raw)[0] === 'baseClass'

		// Если есть props/states — это точно options-объект
		// Если только baseClass — тоже трактуем как options-объект
		const isOptionsObject = hasPropsKey || hasStatesKey || isOnlyBaseClass

		if (isOptionsObject) {
			const opt = options as IComponentViewOptions<TProps, TStates>
			const props = (opt.props ?? {}) as Partial<TProps>

			return {
				props,
				states: opt.states,
				baseClass: opt.baseClass ?? props.baseClass ?? defaultBaseClass,
			}
		}

		// Иначе это plain props
		const props = options as Partial<TProps>
		return {
			props,
			baseClass: props.baseClass ?? defaultBaseClass,
		}
	}

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		const ctor = new.target as typeof TComponentView
		const {
			props = {} as Partial<TProps>,
			baseClass,
			states,
		} = ctor.prepareOptions<TProps, TStates>(options)

		super({ props })

		this._tag = props.tag ?? TComponentView.defaultValues.tag!

		// Инициализируем состояния видимости
		const rendered = props.rendered ?? (TComponentView.defaultValues.rendered as boolean)
		const visible = props.visible ?? (TComponentView.defaultValues.visible as boolean)

		this._renderedState = resolveState<IStateUnit<boolean>, boolean>(
			states?.rendered,
			TStateUnit,
			rendered,
		)
		this._visibilityState = resolveState<IVisibilityState, boolean>(
			states?.visible,
			TVisibilityState,
			visible,
		)

		this._renderedState.events.on('change', (value) =>
			this.events.emit('change:rendered', value),
		)
		this._visibilityState.events.on('change', (value) =>
			this.events.emit('change:visible', value),
		)

		this._baseClass = baseClass
		this._classes = (props.classes ?? TComponentView.defaultValues.classes!) as string[]
		this._attrs = (props.attrs ?? TComponentView.defaultValues.attrs!) as Record<
			string,
			unknown
		>
	}

	get rendered(): boolean {
		return this._renderedState.value
	}
	set rendered(value: boolean) {
		if (value === this._renderedState.value) return

		this._renderedState.value = value
	}

	get visible(): boolean {
		return this._visibilityState.value
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

		const canShow = this.events.emitWithResult('beforeShow')
		if (!canShow) return

		if (this.visible) return
		this._visibilityState.show()

		this.events.emit('show')

		this.afterShow()
		this.events.emit('afterShow')
	}

	hide(): void {
		if (!this.beforeHide()) return

		const canHide = this.events.emitWithResult('beforeHide')
		if (!canHide) return

		if (!this.visible) return
		this._visibilityState.hide()

		this.events.emit('hide')

		this.afterHide()
		this.events.emit('afterHide')
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

		this.events.emit('change:tag', value)
	}

	get attrs(): Record<string, unknown> {
		return this._attrs
	}
	set attrs(value: Record<string, unknown>) {
		if (this._attrs === value) return

		this._attrs = value

		this.events.emit('change:attrs', value)
	}

	get classes(): string[] {
		return [this._baseClass, ...this._classes]
	}

	setClasses(value: string[]): void {
		if (this._classes === value) return

		this._classes = value

		this.events.emit('change:classes', value)
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
