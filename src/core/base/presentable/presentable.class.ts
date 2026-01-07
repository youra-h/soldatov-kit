import { TComponentModel } from '../component-model'
import type { IComponentModelOptions, IComponentModelProps } from '../component-model'
import { TVisibilityState } from '../states'
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
		visible: true,
		classes: [],
		attrs: {},
	}

	protected _tag: string | object
	protected _visibility: TVisibilityState
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
		if (options && typeof options === 'object' && 'props' in options) {
			const normalized = options as IComponentModelOptions<T> & { baseClass?: string }

			return {
				...normalized,
				baseClass:
					normalized.baseClass ??
					defaultBaseClass ??
					(this as typeof TPresentable).baseClass,
			}
		}

		return {
			props: options as Partial<T>,
			baseClass: defaultBaseClass ?? (this as typeof TPresentable).baseClass,
		}
	}

	constructor(options: IPresentableOptions<TProps> | Partial<TProps> = {}) {
		const ctor = new.target as typeof TPresentable
		const { props = {} as Partial<TProps>, baseClass } = ctor.prepareOptions<TProps>(options)

		super({ props })

		this._tag = props.tag ?? TPresentable.defaultValues.tag!

		this._visibility = new TVisibilityState(
			typeof props.visible === 'boolean'
				? props.visible
				: (TPresentable.defaultValues.visible as boolean),
		)
		this._visibility.events.on('change', (value) => {
			this.events.emit('change:visible', value)
		})

		this._baseClass = baseClass
		this._classes = (props.classes ?? TPresentable.defaultValues.classes!) as string[]
		this._attrs = (props.attrs ?? TPresentable.defaultValues.attrs!) as Record<string, unknown>
	}

	get visible(): boolean {
		return this._visibility.visible
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
		this._visibility.show()

		this.events.emit('show' as any)

		this.afterShow()
		this.events.emit('afterShow' as any)
	}

	hide(): void {
		if (!this.beforeHide()) return

		const canHide = this.events.emitWithResult('beforeHide' as any)
		if (!canHide) return

		if (!this.visible) return
		this._visibility.hide()

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
			visible: this.visible,
			baseClass: this._baseClass,
			classes: this._classes,
			attrs: this._attrs,
		} as TProps
	}
}
