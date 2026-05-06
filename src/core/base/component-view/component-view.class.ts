import { TComponentModel } from '../component-model'
import { TVisibilityState } from '../states'
import type { IVisibilityState } from '../states'
import { resolveState } from '../../common/resolve-state'
import type {
	IComponentViewOptions,
	IComponentViewProps,
	TComponentViewEvents,
	TComponentViewStatesOptions,
	TComponentViewPreparedOptions,
} from './types'
import { type IStateUnit, TStateUnit } from '../state-unit'
import { TClasses } from '../../common/classes'

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
	TStates extends TComponentViewStatesOptions = TComponentViewStatesOptions,
> extends TComponentModel<TProps, TEvents> {
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
	protected _renderedState: IStateUnit<boolean>
	protected _visibilityState: IVisibilityState

	static prepareOptions<
		TProps extends IComponentViewProps = IComponentViewProps,
		TStates extends TComponentViewStatesOptions = TComponentViewStatesOptions,
	>(
		options: IComponentViewOptions<TProps, TStates> | Partial<TProps>,
	): TComponentViewPreparedOptions<TProps, TStates> {
		const raw = options as Record<string, unknown>
		const hasPropsKey = Object.prototype.hasOwnProperty.call(raw, 'props')
		const hasStatesKey = Object.prototype.hasOwnProperty.call(raw, 'states')
		const hasRenderConfigKey = Object.prototype.hasOwnProperty.call(raw, 'renderConfig')

		// Если есть props/states/renderConfig — это точно options-объект
		const isOptionsObject = hasPropsKey || hasStatesKey || hasRenderConfigKey

		if (isOptionsObject) {
			const opt = options as IComponentViewOptions<TProps, TStates>
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

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		const ctor = new.target as typeof TComponentView

		const { props = {} as Partial<TProps>, states } = ctor.prepareOptions<TProps, TStates>(
			options,
		)

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

		this._classes = new TClasses(ctor.baseClass)

		this._classes.events.on('change', () => this.events.emit('change:classes', this._classes))
	}

	get classes(): TClasses | string[] {
		return this._classes
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

	get ready(): boolean {
		return this._ready
	}
	set ready(value: boolean) {
		if (this._ready === value) return

		this._ready = value

		this.events.emit('change:ready', value)
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
