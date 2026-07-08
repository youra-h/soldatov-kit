import { TComponent } from '../component'
import type {
	IComponentViewOptions,
	IComponentViewProps,
	TComponentViewEvents,
	TComponentViewStates,
} from './types'
import { TClasses } from '../../../common'
import { TEvented } from '../../../common'

/**
 * Web-component-view слой: tag/classes.
 *
 * Это слой, который удобен для UI-обёрток (Vue/React):
 * - `tag` (div/button/custom)
 * - `classes` (baseClass + динамические)
 *
 * visible/rendered наследуются от TComponent.
 */
export default class TComponentView<
	TProps extends IComponentViewProps = IComponentViewProps,
	TEvents extends TComponentViewEvents = TComponentViewEvents,
	TStates extends TComponentViewStates = TComponentViewStates,
> extends TComponent<TProps, TEvents, TStates> {
	/** Базовый CSS-класс по умолчанию (можно переопределить в наследниках). */
	static baseClass = 's-component-view'

	static defaultValues: Partial<IComponentViewProps> = {
		...TComponent.defaultValues,
		id: '',
		tag: 'div',
	}

	protected _tag: string | object
	protected _classes: TClasses
	protected _ready: boolean = false

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		const ctor = new.target as typeof TComponentView

		const { props = {} as Partial<TProps> } = ctor.prepareOptions<TProps, TStates>(
			options,
		)

		super(options)

		this._tag = props.tag ?? ctor.defaultValues.tag!

		this._classes = new TClasses(ctor.baseClass)

		this._classes.events.on('change', () =>
			(this.events as TEvented<TComponentViewEvents>).emit(
				'change:classes',
				this._classes.toArray(),
			),
		)
	}

	get classes(): TClasses {
		return this._classes
	}

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
		} as TProps
	}
}
